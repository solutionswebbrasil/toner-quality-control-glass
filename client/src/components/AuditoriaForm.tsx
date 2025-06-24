
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { auditoriaService } from '@/services/auditoriaService';
import { fileUploadService } from '@/services/fileUploadService';
import { supabase } from '@/integrations/supabase/client';
import type { Auditoria } from '@/types';

const auditoriaSchema = z.object({
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().min(1, 'Data de fim é obrigatória'),
  unidade_auditada: z.string().min(1, 'Unidade auditada é obrigatória'),
});

type AuditoriaFormData = z.infer<typeof auditoriaSchema>;

interface AuditoriaFormProps {
  onSuccess: () => void;
}

export const AuditoriaForm: React.FC<AuditoriaFormProps> = ({ onSuccess }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuditoriaFormData>({
    resolver: zodResolver(auditoriaSchema),
    defaultValues: {
      data_inicio: '',
      data_fim: '',
      unidade_auditada: '',
    },
  });

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Erro',
          description: 'Apenas arquivos PDF são permitidos.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: 'Erro',
          description: 'O arquivo PDF deve ter no máximo 10MB.',
          variant: 'destructive',
        });
        return;
      }
      setPdfFile(file);
    }
  };

  const onSubmit = async (data: AuditoriaFormData) => {
    try {
      setIsSubmitting(true);
      
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Erro',
          description: 'Usuário não autenticado.',
          variant: 'destructive',
        });
        return;
      }

      let formulario_pdf_url: string | undefined = undefined;
      
      // Upload do arquivo PDF se fornecido
      if (pdfFile) {
        try {
          formulario_pdf_url = await fileUploadService.uploadPdf(pdfFile, 'auditorias');
        } catch (uploadError) {
          toast({
            title: 'Erro no Upload',
            description: 'Erro ao fazer upload do PDF. Tente novamente.',
            variant: 'destructive',
          });
          return;
        }
      }

      // Criar objeto auditoria para salvar no banco
      const auditoria: Omit<Auditoria, 'id' | 'data_registro'> = {
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        unidade_auditada: data.unidade_auditada,
        formulario_pdf: formulario_pdf_url,
        user_id: user.id,
      };

      await auditoriaService.create(auditoria);

      toast({
        title: 'Sucesso',
        description: 'Auditoria registrada com sucesso!',
      });

      // Limpar formulário
      form.reset();
      setPdfFile(null);
      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar auditoria. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Registro de Auditoria
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Registre uma nova auditoria no sistema
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dados da Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="unidade_auditada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade Auditada</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da unidade auditada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="formulario_pdf">Formulário PDF (Opcional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="formulario_pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {pdfFile && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    PDF selecionado: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setPdfFile(null);
                  }}
                >
                  Limpar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrar Auditoria'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
