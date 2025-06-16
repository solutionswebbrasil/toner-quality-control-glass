
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { naoConformidadeService } from '@/services/naoConformidadeService';
import { NaoConformidade } from '@/types/naoConformidade';

export const NaoConformidadeForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [necessitaAcaoCorretiva, setNecessitaAcaoCorretiva] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<Omit<NaoConformidade, 'id' | 'data_registro' | 'data_atualizacao'>>();

  const onSubmit = async (data: Omit<NaoConformidade, 'id' | 'data_registro' | 'data_atualizacao'>) => {
    setLoading(true);
    try {
      const naoConformidadeData = {
        ...data,
        necessita_acao_corretiva: necessitaAcaoCorretiva,
        evidencias: [], // Changed to empty array that will be converted to JSONB
        status: 'Aberta' as const
      };

      await naoConformidadeService.create(naoConformidadeData);
      
      toast({
        title: "Sucesso",
        description: "Não conformidade registrada com sucesso!",
      });
      
      reset();
      setNecessitaAcaoCorretiva(false);
    } catch (error) {
      console.error('Erro ao registrar não conformidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar não conformidade.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Registro de Não Conformidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="data_ocorrencia">Data da Ocorrência *</Label>
                <Input
                  id="data_ocorrencia"
                  type="date"
                  {...register('data_ocorrencia', { required: 'Campo obrigatório' })}
                />
                {errors.data_ocorrencia && (
                  <p className="text-red-500 text-sm mt-1">{errors.data_ocorrencia.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="unidade_filial">Unidade / Filial *</Label>
                <Input
                  id="unidade_filial"
                  {...register('unidade_filial', { required: 'Campo obrigatório' })}
                  placeholder="Ex: Matriz, Filial 01..."
                />
                {errors.unidade_filial && (
                  <p className="text-red-500 text-sm mt-1">{errors.unidade_filial.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="setor_responsavel">Setor Responsável *</Label>
                <Input
                  id="setor_responsavel"
                  {...register('setor_responsavel', { required: 'Campo obrigatório' })}
                  placeholder="Ex: Produção, Qualidade, TI..."
                />
                {errors.setor_responsavel && (
                  <p className="text-red-500 text-sm mt-1">{errors.setor_responsavel.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tipo_nc">Tipo de Não Conformidade *</Label>
                <Select onValueChange={(value) => setValue('tipo_nc', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produto">Produto</SelectItem>
                    <SelectItem value="Processo">Processo</SelectItem>
                    <SelectItem value="Serviço">Serviço</SelectItem>
                    <SelectItem value="Sistema">Sistema</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo_nc && (
                  <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>
                )}
              </div>

              <div>
                <Label htmlFor="classificacao">Classificação *</Label>
                <Select onValueChange={(value) => setValue('classificacao', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leve">Leve</SelectItem>
                    <SelectItem value="Moderada">Moderada</SelectItem>
                    <SelectItem value="Grave">Grave</SelectItem>
                    <SelectItem value="Crítica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
                {errors.classificacao && (
                  <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>
                )}
              </div>

              <div>
                <Label htmlFor="identificado_por">Identificado por *</Label>
                <Input
                  id="identificado_por"
                  {...register('identificado_por', { required: 'Campo obrigatório' })}
                  placeholder="Nome do colaborador/auditor"
                />
                {errors.identificado_por && (
                  <p className="text-red-500 text-sm mt-1">{errors.identificado_por.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="responsavel_tratamento">Responsável pelo Tratamento *</Label>
                <Input
                  id="responsavel_tratamento"
                  {...register('responsavel_tratamento', { required: 'Campo obrigatório' })}
                  placeholder="Nome do responsável"
                />
                {errors.responsavel_tratamento && (
                  <p className="text-red-500 text-sm mt-1">{errors.responsavel_tratamento.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="data_limite_correcao">Data Limite para Correção *</Label>
                <Input
                  id="data_limite_correcao"
                  type="date"
                  {...register('data_limite_correcao', { required: 'Campo obrigatório' })}
                />
                {errors.data_limite_correcao && (
                  <p className="text-red-500 text-sm mt-1">{errors.data_limite_correcao.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição da Não Conformidade *</Label>
              <Textarea
                id="descricao"
                {...register('descricao', { required: 'Campo obrigatório' })}
                placeholder="Descreva detalhadamente a não conformidade identificada..."
                rows={4}
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="acao_imediata">Ação Imediata Tomada</Label>
              <Textarea
                id="acao_imediata"
                {...register('acao_imediata')}
                placeholder="Descreva as ações imediatas tomadas..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="necessita_acao_corretiva"
                checked={necessitaAcaoCorretiva}
                onCheckedChange={(checked) => setNecessitaAcaoCorretiva(checked as boolean)}
              />
              <Label htmlFor="necessita_acao_corretiva">
                Necessita Ação Corretiva?
              </Label>
            </div>

            {necessitaAcaoCorretiva && (
              <div>
                <Label htmlFor="acao_corretiva_proposta">Ação Corretiva Proposta</Label>
                <Textarea
                  id="acao_corretiva_proposta"
                  {...register('acao_corretiva_proposta')}
                  placeholder="Descreva a ação corretiva proposta..."
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                {...register('observacoes')}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setNecessitaAcaoCorretiva(false);
                }}
              >
                Limpar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Registrar NC'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
