
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { tituloItPopService } from '@/services/tituloItPopService';
import { registroItPopService } from '@/services/registroItPopService';
import { fileUploadService } from '@/services/fileUploadService';
import type { RegistroItPop, TituloItPop } from '@/types';

const registroSchema = z.object({
  titulo_id: z.string().min(1, 'Selecione um título'),
  registrado_por: z.string().optional(),
});

type RegistroFormData = z.infer<typeof registroSchema>;

interface RegistroItPopFormProps {
  onSuccess: () => void;
}

export const RegistroItPopForm: React.FC<RegistroItPopFormProps> = ({ onSuccess }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titulos, setTitulos] = useState<TituloItPop[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      titulo_id: '',
      registrado_por: '',
    },
  });

  useEffect(() => {
    const carregarTitulos = async () => {
      try {
        console.log('🔍 Carregando títulos IT/POP...');
        setLoading(true);
        const titulosData = await tituloItPopService.getAll();
        setTitulos(titulosData);
        console.log('✅ Títulos carregados:', titulosData.length);
      } catch (error) {
        console.error('❌ Erro ao carregar títulos:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar títulos. Tente recarregar a página.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    carregarTitulos();
  }, []);

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
      console.log('📎 Arquivo PDF selecionado:', file.name, 'Tamanho:', file.size);
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
      if (file.size > 20 * 1024 * 1024) { // 20MB
        toast({
          title: 'Erro',
          description: 'O arquivo PPT deve ter no máximo 20MB.',
          variant: 'destructive',
        });
        return;
      }
      console.log('📎 Arquivo PPT selecionado:', file.name, 'Tamanho:', file.size);
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
      console.log('🚀 Iniciando registro de IT/POP...', {
        titulo_id: data.titulo_id,
        registrado_por: data.registrado_por,
        temPDF: !!pdfFile,
        temPPT: !!pptFile
      });
      
      let arquivo_pdf_url = null;
      let arquivo_ppt_url = null;
      
      // Upload do arquivo PDF se existir
      if (pdfFile) {
        console.log('📤 Fazendo upload do PDF...');
        try {
          arquivo_pdf_url = await fileUploadService.uploadPdf(pdfFile, 'itpop');
          console.log('✅ PDF uploaded com sucesso:', arquivo_pdf_url);
        } catch (uploadError) {
          console.error('❌ Erro no upload do PDF:', uploadError);
          toast({
            title: 'Erro no Upload',
            description: 'Erro ao fazer upload do PDF. Tente novamente.',
            variant: 'destructive',
          });
          return;
        }
      }

      // Upload do arquivo PPT se existir
      if (pptFile) {
        console.log('📤 Fazendo upload do PPT...');
        try {
          arquivo_ppt_url = await fileUploadService.uploadPdf(pptFile, 'itpop');
          console.log('✅ PPT uploaded com sucesso:', arquivo_ppt_url);
        } catch (uploadError) {
          console.error('❌ Erro no upload do PPT:', uploadError);
          toast({
            title: 'Erro no Upload',
            description: 'Erro ao fazer upload do PPT. Tente novamente.',
            variant: 'destructive',
          });
          return;
        }
      }

      // Criar objeto registro para salvar no banco
      const registro: Omit<RegistroItPop, 'id' | 'versao' | 'titulo'> = {
        titulo_id: parseInt(data.titulo_id),
        arquivo_pdf: arquivo_pdf_url || undefined,
        arquivo_ppt: arquivo_ppt_url || undefined,
        data_registro: new Date().toISOString(),
        registrado_por: data.registrado_por || undefined,
      };

      console.log('💾 Salvando registro no banco:', registro);
      const novoRegistro = await registroItPopService.create(registro);
      console.log('✅ Registro salvo com sucesso:', novoRegistro);

      toast({
        title: 'Sucesso',
        description: `IT/POP registrado com sucesso! Versão ${novoRegistro.versao} criada.`,
      });

      // Limpar formulário
      form.reset();
      setPdfFile(null);
      setPptFile(null);
      onSuccess();
    } catch (error) {
      console.error('❌ Erro ao registrar IT/POP:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar IT/POP. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Registro de IT/POP
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando títulos disponíveis...
          </p>
        </div>
      </div>
    );
  }

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
                        {titulos.map((titulo) => (
                          <SelectItem key={titulo.id} value={titulo.id!.toString()}>
                            {titulo.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrado_por"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registrado por (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome de quem está registrando" {...field} />
                    </FormControl>
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
                      PDF selecionado: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
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
                      PPT selecionado: {pptFile.name} ({(pptFile.size / (1024 * 1024)).toFixed(2)} MB)
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
