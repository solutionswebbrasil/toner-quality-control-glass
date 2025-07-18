
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wrench, Calendar, User, Building2, AlertCircle } from 'lucide-react';
import { garantiaTonerService, GarantiaToner } from '@/services/garantiaTonerService';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const GarantiaTonerGrid: React.FC = () => {
  const { theme } = useTheme();
  const [garantias, setGarantias] = useState<GarantiaToner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<GarantiaToner['status']>('Pendente');
  const [destinoFinal, setDestinoFinal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadGarantias();
  }, []);

  const loadGarantias = async () => {
    try {
      setLoading(true);
      const data = await garantiaTonerService.getAll();
      // Filtrar apenas garantias que não estão concluídas
      const garantiasPendentes = data.filter(g => g.status !== 'Concluído');
      setGarantias(garantiasPendentes);
    } catch (error) {
      console.error('Erro ao carregar garantias de toners:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar garantias de toners.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number) => {
    try {
      setUpdating(true);
      let finalObservacoes = observacoes;
      if (destinoFinal) {
        finalObservacoes = `${destinoFinal}${observacoes ? ` - ${observacoes}` : ''}`;
      }
      
      await garantiaTonerService.updateStatus(id, newStatus, finalObservacoes);
      await loadGarantias();
      setEditingId(null);
      setObservacoes('');
      setDestinoFinal('');
      
      toast({
        title: "Sucesso!",
        description: "Status da garantia atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da garantia.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: GarantiaToner['status']) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Em Análise': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Aguardando Toner Chegar no Laboratório': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Enviado para Fornecedor': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Concluído': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardContent className="p-6">
          <div className="text-center">Carregando garantias de toners...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Garantias de Toners Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {garantias.length === 0 ? (
          <div className="text-center py-8">
            Nenhuma garantia de toner pendente.
          </div>
        ) : (
          <div className="space-y-4">
            {garantias.map((garantia) => (
              <div
                key={garantia.id}
                className="border rounded-lg p-4 backdrop-blur bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{garantia.modelo_toner}</h3>
                      <Badge className={`${getStatusColor(garantia.status)} border-0`}>
                        {garantia.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Ticket: {garantia.ticket_numero}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Filial</div>
                      <div className="font-medium">{garantia.filial_origem}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Responsável</div>
                      <div className="font-medium">{garantia.responsavel_envio}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Data Envio</div>
                      <div className="font-medium">
                        {new Date(garantia.data_envio).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Fornecedor:</span>
                    <span>{garantia.fornecedor}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Defeito:</span> {garantia.defeito}
                  </div>
                  {garantia.observacoes && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">Observações:</span> {garantia.observacoes}
                    </div>
                  )}
                </div>

                {editingId === garantia.id ? (
                  <div className="space-y-3 border-t pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Novo Status</Label>
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as GarantiaToner['status'])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Em Análise">Em Análise</SelectItem>
                            <SelectItem value="Aguardando Toner Chegar no Laboratório">Aguardando Toner Chegar no Laboratório</SelectItem>
                            <SelectItem value="Enviado para Fornecedor">Enviado para Fornecedor</SelectItem>
                            <SelectItem value="Concluído">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Destino Final</Label>
                        <Select value={destinoFinal} onValueChange={setDestinoFinal}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o destino" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nao_definido">Não definido</SelectItem>
                            <SelectItem value="Virou crédito">Virou crédito</SelectItem>
                            <SelectItem value="Garantia expirada">Garantia expirada</SelectItem>
                            <SelectItem value="Não era uma garantia válida">Não era uma garantia válida</SelectItem>
                            <SelectItem value="Virou troca">Virou troca</SelectItem>
                            <SelectItem value="Virou bonificação">Virou bonificação</SelectItem>
                            <SelectItem value="Fornecedor consertou">Fornecedor consertou</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Observações</Label>
                        <Textarea
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Observações adicionais..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(garantia.id!)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updating}
                      >
                        {updating ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setObservacoes('');
                          setDestinoFinal('');
                          setNewStatus('Pendente');
                        }}
                        size="sm"
                        variant="outline"
                        disabled={updating}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-3">
                    <Button
                      onClick={() => {
                        setEditingId(garantia.id!);
                        setNewStatus(garantia.status);
                        setObservacoes(garantia.observacoes || '');
                        setDestinoFinal('');
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Atualizar Status
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
