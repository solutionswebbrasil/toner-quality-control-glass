
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { tituloBpmnService } from '@/services/tituloBpmnService';
import { registroBpmnService } from '@/services/registroBpmnService';
import { fileUploadService } from '@/services/fileUploadService';
import type { RegistroBpmn, TituloBpmn } from '@/types';

const registroSchema = z.object({
  titulo_id: z.string().min(1, 'Selecione um título'),
  registrado_por: z.string().optional(),
});

type RegistroFormData = z.infer<typeof registroSchema>;

interface RegistroBpmnFormProps {
  onSuccess: () => void;
}

export const RegistroBpmnForm: React.FC<RegistroBpmnFormProps> = ({ onSuccess }) => {
  const [jpgFile, setJpgFile] = useState<File | null>(null);
  const [pngFile, setPngFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titulos, setTitulos] = useState<TituloBpmn[]>([]);
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
        console.log('🔍 Carregando títulos BPMN...');
        setLoading(true);
        const titulosData = await tituloBpmnService.getAll();
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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'jpg' | 'png' | 'zip',
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      let isValid = false;
      let errorMessage = '';

      switch (type) {
        case 'jpg':
          isValid = file.type === 'image/jpeg';
          errorMessage = 'Apenas arquivos JPG são permitidos.';
          break;
        case 'png':
          isValid = file.type === 'image/png';
          errorMessage = 'Apenas arquivos PNG são permitidos.';
          break;
        case 'zip':
          isValid = file.type === 'application/zip' || file.name.endsWith('.zip');
          errorMessage = 'Apenas arquivos ZIP são permitidos.';
          break;
      }

      if (!isValid) {
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: 'Erro',
          description: 'O arquivo deve ter no máximo 10MB.',
          variant: 'destructive',
        });
        return;
      }

      console.log(`📎 Arquivo ${type.toUpperCase()} selecionado:`, file.name, 'Tamanho:', file.size);
      setFile(file);
    }
  };

  const onSubmit = async (data: RegistroFormData) => {
    if (!jpgFile && !pngFile && !zipFile) {
      toast({
        title: 'Erro',
        description: 'Anexe pelo menos um arquivo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('🚀 Iniciando registro de BPMN...', {
        titulo_id: data.titulo_id,
        registrado_por: data.registrado_por,
        arquivos: {
          jpg: !!jpgFile,
          png: !!pngFile,
          zip: !!zipFile
        }
      });
      
      let arquivo_jpg_url = null;
      let arquivo_png_url = null;
      let arquivo_zip_url = null;
      
      // Upload dos arquivos
      try {
        if (jpgFile) {
          console.log('📤 Fazendo upload do JPG...');
          arquivo_jpg_url = await fileUploadService.uploadImage(jpgFile, 'bpmn');
          console.log('✅ JPG uploaded:', arquivo_jpg_url);
        }

        if (pngFile) {
          console.log('📤 Fazendo upload do PNG...');
          arquivo_png_url = await fileUploadService.uploadImage(pngFile, 'bpmn');
          console.log('✅ PNG uploaded:', arquivo_png_url);
        }

        if (zipFile) {
          console.log('📤 Fazendo upload do ZIP...');
          arquivo_zip_url = await fileUploadService.uploadFile(zipFile, 'bpmn');
          console.log('✅ ZIP uploaded:', arquivo_zip_url);
        }
      } catch (uploadError) {
        console.error('❌ Erro no upload dos arquivos:', uploadError);
        toast({
          title: 'Erro no Upload',
          description: 'Erro ao fazer upload dos arquivos. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      // Criar objeto registro para salvar no banco
      const registro: Omit<RegistroBpmn, 'id' | 'versao' | 'titulo'> = {
        titulo_id: parseInt(data.titulo_id),
        arquivo_jpg: arquivo_jpg_url || undefined,
        arquivo_png: arquivo_png_url || undefined,
        arquivo_zip: arquivo_zip_url || undefined,
        data_registro: new Date().toISOString(),
        registrado_por: data.registrado_por || undefined,
      };

      console.log('💾 Salvando registro no banco:', registro);
      const novoRegistro = await registroBpmnService.create(registro);
      console.log('✅ Registro salvo com sucesso:', novoRegistro);

      toast({
        title: 'Sucesso',
        description: `BPMN registrado com sucesso! Versão ${novoRegistro.versao} criada.`,
      });

      // Limpar formulário
      form.reset();
      setJpgFile(null);
      setPngFile(null);
      setZipFile(null);
      onSuccess();
    } catch (error) {
      console.error('❌ Erro ao registrar BPMN:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar BPMN. Verifique os dados e tente novamente.',
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
            Registro de BPMN
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
          Registro de BPMN
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Registre uma nova versão de BPMN (apenas imagens ou arquivo ZIP)
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
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
                    <FormLabel>Título BPMN</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="arquivo_jpg">Arquivo JPG</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="arquivo_jpg"
                      type="file"
                      accept=".jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, 'jpg', setJpgFile)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {jpgFile && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      JPG: {jpgFile.name} ({(jpgFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo_png">Arquivo PNG</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="arquivo_png"
                      type="file"
                      accept=".png"
                      onChange={(e) => handleFileChange(e, 'png', setPngFile)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {pngFile && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      PNG: {pngFile.name} ({(pngFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo_zip">Arquivo ZIP</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="arquivo_zip"
                      type="file"
                      accept=".zip"
                      onChange={(e) => handleFileChange(e, 'zip', setZipFile)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {zipFile && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ZIP: {zipFile.name} ({(zipFile.size / (1024 * 1024)).toFixed(2)} MB)
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
                    setJpgFile(null);
                    setPngFile(null);
                    setZipFile(null);
                  }}
                >
                  Limpar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrar BPMN'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
