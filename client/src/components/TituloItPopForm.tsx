
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { tituloItPopService } from '@/services/tituloItPopService';
import type { TituloItPop } from '@/types';

const tituloSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
});

type TituloFormData = z.infer<typeof tituloSchema>;

interface TituloItPopFormProps {
  onSuccess: () => void;
}

export const TituloItPopForm: React.FC<TituloItPopFormProps> = ({ onSuccess }) => {
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
      console.log('🚀 Iniciando cadastro de título IT/POP...', data);
      
      const titulo: Omit<TituloItPop, 'id'> = {
        titulo: data.titulo,
        descricao: data.descricao || '',
        data_cadastro: new Date().toISOString(),
      };

      await tituloItPopService.create(titulo);

      toast({
        title: 'Sucesso',
        description: 'Título IT/POP cadastrado com sucesso!',
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('❌ Erro ao cadastrar título:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar título. Tente novamente.',
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
          Cadastro de Título IT/POP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Cadastre um novo título para documentos IT/POP
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Novo Título IT/POP
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
                      <Input placeholder="Digite o título do IT/POP" {...field} />
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
