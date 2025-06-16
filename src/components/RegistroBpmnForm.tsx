
import React, { useState } from 'react';
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
import type { RegistroBpmn } from '@/types';

const registroSchema = z.object({
  titulo_id: z.string().min(1, 'Selecione um título'),
});

type RegistroFormData = z.infer<typeof registroSchema>;

interface RegistroBpmnFormProps {
  onSuccess: () => void;
}

// Mock data
const titulosDisponiveis = [
  { id: 1, titulo: 'Processo de Aprovação' },
  { id: 2, titulo: 'Fluxo de Vendas' },
  { id: 3, titulo: 'Gestão de Projetos' },
];

export const RegistroBpmnForm: React.FC<RegistroBpmnFormProps> = ({ onSuccess }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jpgFile, setJpgFile] = useState<File | null>(null);
  const [pngFile, setPngFile] = useState<File | null>(null);
  const [bizagiFile, setBizagiFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      titulo_id: '',
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'pdf' | 'jpg' | 'png' | 'bizagi',
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      let isValid = false;
      let errorMessage = '';

      switch (type) {
        case 'pdf':
          isValid = file.type === 'application/pdf';
          errorMessage = 'Apenas arquivos PDF são permitidos.';
          break;
        case 'jpg':
          isValid = file.type === 'image/jpeg';
          errorMessage = 'Apenas arquivos JPG são permitidos.';
          break;
        case 'png':
          isValid = file.type === 'image/png';
          errorMessage = 'Apenas arquivos PNG são permitidos.';
          break;
        case 'bizagi':
          isValid = file.name.endsWith('.bizagi') || file.type === 'application/octet-stream';
          errorMessage = 'Apenas arquivos Bizagi são permitidos.';
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

      setFile(file);
    }
  };

  const onSubmit = async (data: RegistroFormData) => {
    if (!pdfFile && !jpgFile && !pngFile && !bizagiFile) {
      toast({
        title: 'Erro',
        description: 'Anexe pelo menos um arquivo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const registro: RegistroBpmn = {
        titulo_id: parseInt(data.titulo_id),
        versao: 1, // Seria calculado automaticamente
        arquivo_pdf: pdfFile ? pdfFile.name : undefined, // Store file name as string
        arquivo_jpg: jpgFile ? jpgFile.name : undefined, // Store file name as string
        arquivo_png: pngFile ? pngFile.name : undefined, // Store file name as string
        arquivo_bizagi: bizagiFile ? bizagiFile.name : undefined, // Store file name as string
        data_registro: new Date().toISOString(), // Convert Date to string
      };

      console.log('Registro BPMN criado:', registro);

      toast({
        title: 'Sucesso',
        description: 'BPMN registrado com sucesso!',
      });

      form.reset();
      setPdfFile(null);
      setJpgFile(null);
      setPngFile(null);
      setBizagiFile(null);
      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar BPMN:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao registrar BPMN. Tente novamente.',
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
          Registro de BPMN
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Registre uma nova versão de BPMN
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
                      onChange={(e) => handleFileChange(e, 'pdf', setPdfFile)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {pdfFile && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      PDF: {pdfFile.name}
                    </p>
                  )}
                </div>

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
                      JPG: {jpgFile.name}
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
                      PNG: {pngFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo_bizagi">Arquivo Bizagi</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="arquivo_bizagi"
                      type="file"
                      accept=".bizagi"
                      onChange={(e) => handleFileChange(e, 'bizagi', setBizagiFile)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {bizagiFile && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Bizagi: {bizagiFile.name}
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
                    setJpgFile(null);
                    setPngFile(null);
                    setBizagiFile(null);
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
