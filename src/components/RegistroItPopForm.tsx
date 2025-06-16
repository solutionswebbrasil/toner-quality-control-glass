
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import type { RegistroItPop } from '@/types';

const registroSchema = z.object({
  titulo_id: z.string().min(1, 'Selecione um título'),
});

type RegistroFormData = z.infer<typeof registroSchema>;

interface RegistroItPopFormProps {
  onSuccess: () => void;
}

// Mock data - seria vindo do serviço
const titulosDisponiveis = [
  { id: 1, titulo: 'Procedimento de Backup' },
  { id: 2, titulo: 'Instalação de Software' },
  { id: 3, titulo: 'Configuração de Rede' },
];

export const RegistroItPopForm: React.FC<RegistroItPopFormProps> = ({ onSuccess }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      titulo_id: '',
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
      setPdfFile(file);
    }
  };

  const handlePptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('presentation') && !file.name.endsWith('.ppt') && !file.name.endsWith('.pptx')) {
        toast({
          title: 'Erro',
          description: 'Apenas arquivos PPT/PPTX são permitidos.',
          variant: 'destructive',
        });
        return;
      }
      setPptFile(file);
    }
  };

  const onSubmit = async (data: RegistroFormData) => {
    if (!pdfFile && !pptFile) {
      toast({
        title: 'Erro',
        description: 'Anexe pelo menos um arquivo (PDF ou PPT).',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const registro: RegistroItPop = {
        titulo_id: parseInt(data.titulo_id),
        versao: 1, // Seria calculado automaticamente
        arquivo_pdf: pdfFile || undefined,
        arquivo_ppt: pptFile || undefined,
        data_registro: new Date(),
      };

      console.log('Registro IT/POP criado:', registro);

      toast({
        title: 'Sucesso',
        description: 'IT/POP registrado com sucesso!',
      });

      form.reset();
      setPdfFile(null);
      setPptFile(null);
      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar IT/POP:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar IT/POP. Tente novamente.',
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
          Registro de IT/POP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Registre uma nova versão de IT/POP
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dados do Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titulo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título IT/POP</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o título" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titulosDisponiveis.map((titulo) => (
                          <SelectItem key={titulo.id} value={titulo.id.toString()}>
                            {titulo.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="arquivo_pdf">Arquivo PDF</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="arquivo_pdf"
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
                      PDF selecionado: {pdfFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo_ppt">Arquivo PPT</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="arquivo_ppt"
                      type="file"
                      accept=".ppt,.pptx"
                      onChange={handlePptChange}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {pptFile && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      PPT selecionado: {pptFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setPdfFile(null);
                    setPptFile(null);
                  }}
                >
                  Limpar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrar IT/POP'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
