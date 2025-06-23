
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layers, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { tituloBpmnService } from '@/services/tituloBpmnService';
import type { TituloBpmn } from '@/types';

const tituloSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
});

type TituloFormData = z.infer<typeof tituloSchema>;

interface TituloBpmnFormProps {
  onSuccess: () => void;
}

export const TituloBpmnForm: React.FC<TituloBpmnFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TituloFormData>({
    resolver: zodResolver(tituloSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
    },
  });

  const onSubmit = async (data: TituloFormData) => {
    try {
      setIsSubmitting(true);
      console.log('🚀 Iniciando cadastro de título BPMN...', data);
      
      const titulo: Omit<TituloBpmn, 'id'> = {
        titulo: data.titulo,
        descricao: data.descricao,
        data_cadastro: new Date().toISOString(),
      };

      console.log('💾 Salvando título BPMN no banco:', titulo);
      const novoTitulo = await tituloBpmnService.create(titulo);
      console.log('✅ Título BPMN salvo com sucesso:', novoTitulo);

      toast({
        title: 'Sucesso',
        description: 'Título BPMN cadastrado com sucesso!',
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('❌ Erro ao cadastrar título BPMN:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar título BPMN. Verifique os dados e tente novamente.',
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
          Cadastro de Título BPMN
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Cadastre um novo título para documentos BPMN
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Novo Título BPMN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do BPMN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite uma descrição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Limpar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Título'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
