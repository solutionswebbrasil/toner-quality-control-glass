
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Upload, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const auditoriaSchema = z.object({
  data_inicio: z.date({
    required_error: 'Data de início é obrigatória',
  }),
  data_fim: z.date({
    required_error: 'Data de fim é obrigatória',
  }),
  unidade_auditada: z.string().min(1, 'Unidade auditada é obrigatória'),
  formulario_pdf: z.any().optional(),
}).refine((data) => data.data_fim >= data.data_inicio, {
  message: "Data de fim deve ser posterior à data de início",
  path: ["data_fim"],
});

type AuditoriaFormData = z.infer<typeof auditoriaSchema>;

interface AuditoriaFormProps {
  onSuccess: () => void;
}

// Mock filiais data
const mockFiliais = [
  { id: '1', nome: 'Filial São Paulo' },
  { id: '2', nome: 'Filial Rio de Janeiro' },
  { id: '3', nome: 'Filial Belo Horizonte' },
];

export const AuditoriaForm: React.FC<AuditoriaFormProps> = ({ onSuccess }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuditoriaFormData>({
    resolver: zodResolver(auditoriaSchema),
    defaultValues: {
      unidade_auditada: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          description: 'O arquivo deve ter no máximo 10MB.',
          variant: 'destructive',
        });
        return;
      }
      console.log('📎 Arquivo PDF selecionado:', file.name, 'Tamanho:', file.size);
      setPdfFile(file);
      form.setValue('formulario_pdf', file);
    }
  };

  const onSubmit = async (data: AuditoriaFormData) => {
    try {
      setIsSubmitting(true);
      console.log('🚀 Registrando auditoria (frontend only):', { 
        dataInicio: data.data_inicio, 
        dataFim: data.data_fim, 
        unidade: data.unidade_auditada,
        temPDF: !!pdfFile 
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Sucesso',
        description: pdfFile 
          ? 'Auditoria registrada com sucesso e PDF anexado!' 
          : 'Auditoria registrada com sucesso!',
      });

      // Limpar formulário
      form.reset();
      setPdfFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      onSuccess();
    } catch (error) {
      console.error('❌ Erro ao registrar auditoria:', error);
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
          Registro de Auditorias
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Registre uma nova auditoria com as informações necessárias
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="pointer-events-auto"
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Fim</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="pointer-events-auto"
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockFiliais.map((filial) => (
                          <SelectItem key={filial.id} value={filial.nome}>
                            {filial.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    onChange={handleFileChange}
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button type="button" variant="outline" size="icon" disabled={isSubmitting}>
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
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }
                  }}
                  disabled={isSubmitting}
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
