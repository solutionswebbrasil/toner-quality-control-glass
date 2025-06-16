
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NaoConformidade } from '@/types/naoConformidade';
import { format } from 'date-fns';
import { Calendar, User, Building2, AlertTriangle } from 'lucide-react';

interface NaoConformidadeViewModalProps {
  naoConformidade: NaoConformidade;
  isOpen: boolean;
  onClose: () => void;
}

export const NaoConformidadeViewModal: React.FC<NaoConformidadeViewModalProps> = ({
  naoConformidade,
  isOpen,
  onClose
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Aberta':
        return 'destructive';
      case 'Em andamento':
        return 'secondary';
      case 'Corrigida':
        return 'default';
      case 'Recusada':
        return 'outline';
      case 'Reaberta':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getClassificacaoBadgeVariant = (classificacao: string) => {
    switch (classificacao) {
      case 'Leve':
        return 'outline';
      case 'Moderada':
        return 'secondary';
      case 'Grave':
        return 'destructive';
      case 'Crítica':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Não Conformidade NC-{String(naoConformidade.id).padStart(4, '0')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Ocorrência</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(naoConformidade.data_ocorrencia), 'dd/MM/yyyy')}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(naoConformidade.status)}>
                    {naoConformidade.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Classificação</label>
                <div className="mt-1">
                  <Badge variant={getClassificacaoBadgeVariant(naoConformidade.classificacao)}>
                    {naoConformidade.classificacao}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de NC</label>
                <div className="mt-1">
                  <span className="text-sm">{naoConformidade.tipo_nc}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Unidade/Filial</label>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">{naoConformidade.unidade_filial}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Setor Responsável</label>
                <div className="mt-1">
                  <span className="text-sm">{naoConformidade.setor_responsavel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição da Não Conformidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{naoConformidade.descricao}</p>
            </CardContent>
          </Card>

          {/* Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsáveis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Identificado por</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{naoConformidade.identificado_por}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Responsável pelo Tratamento</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{naoConformidade.responsavel_tratamento}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          {(naoConformidade.acao_imediata || naoConformidade.acao_corretiva_proposta) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {naoConformidade.acao_imediata && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ação Imediata</label>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{naoConformidade.acao_imediata}</p>
                  </div>
                )}

                {naoConformidade.acao_corretiva_proposta && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ação Corretiva Proposta</label>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{naoConformidade.acao_corretiva_proposta}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Prazos e Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Data Limite para Correção</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{format(new Date(naoConformidade.data_limite_correcao), 'dd/MM/yyyy')}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Necessita Ação Corretiva</label>
                <div className="mt-1">
                  <Badge variant={naoConformidade.necessita_acao_corretiva ? 'destructive' : 'secondary'}>
                    {naoConformidade.necessita_acao_corretiva ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </div>

              {naoConformidade.observacoes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Observações</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{naoConformidade.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
