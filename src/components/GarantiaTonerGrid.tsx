
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

export const GarantiaTonerGrid: React.FC = () => {
  const [garantias, setGarantias] = useState<GarantiaToner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<GarantiaToner['status']>('Pendente');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    loadGarantias();
  }, []);

  const loadGarantias = async () => {
    try {
      const data = await garantiaTonerService.getAll();
      setGarantias(data);
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
      await garantiaTonerService.updateStatus(id, newStatus, observacoes);
      await loadGarantias();
      setEditingId(null);
      setObservacoes('');
      
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
    }
  };

  const getStatusColor = (status: GarantiaToner['status']) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Em Análise': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Aprovada': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Recusada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Concluída': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
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
          <div className="text-center py-8 text-gray-500">
            Nenhuma garantia de toner registrada.
          </div>
        ) : (
          <div className="space-y-4">
            {garantias.map((garantia) => (
              <div
                key={garantia.id}
                className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{garantia.modelo_toner}</h3>
                      <Badge className={`${getStatusColor(garantia.status)} border-0`}>
                        {garantia.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Novo Status</Label>
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as GarantiaToner['status'])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Em Análise">Em Análise</SelectItem>
                            <SelectItem value="Aprovada">Aprovada</SelectItem>
                            <SelectItem value="Recusada">Recusada</SelectItem>
                            <SelectItem value="Concluída">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Observações</Label>
                        <Textarea
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Adicione observações sobre a atualização..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(garantia.id!)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Salvar
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setObservacoes('');
                          setNewStatus('Pendente');
                        }}
                        size="sm"
                        variant="outline"
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
