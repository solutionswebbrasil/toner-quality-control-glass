
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

  const getCardClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-card";
    }
    return "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50";
  };

  const getTextClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-text";
    }
    return "";
  };

  const getLabelClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-label";
    }
    return "";
  };

  const getInputClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-input";
    }
    return "";
  };

  const getButtonClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-button";
    }
    return "";
  };

  if (loading) {
    return (
      <Card className={cn(getCardClasses())}>
        <CardContent className="p-6">
          <div className={cn("text-center", getTextClasses())}>Carregando garantias de toners...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(getCardClasses())}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", theme === 'dark-plus' && "dark-plus-title")}>
          <Wrench className="w-5 h-5" />
          Garantias de Toners Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {garantias.length === 0 ? (
          <div className={cn("text-center py-8", getTextClasses())}>
            Nenhuma garantia de toner pendente.
          </div>
        ) : (
          <div className="space-y-4">
            {garantias.map((garantia) => (
              <div
                key={garantia.id}
                className={cn(
                  "border rounded-lg p-4 backdrop-blur",
                  theme === 'dark-plus' ? "dark-plus-card" : "bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={cn("font-semibold text-lg", getTextClasses())}>{garantia.modelo_toner}</h3>
                      <Badge className={`${getStatusColor(garantia.status)} border-0`}>
                        {garantia.status}
                      </Badge>
                    </div>
                    <div className={cn("text-sm font-medium", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-600 dark:text-gray-400")}>
                      Ticket: {garantia.ticket_numero}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className={cn("text-xs", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-500")}>Filial</div>
                      <div className={cn("font-medium", getTextClasses())}>{garantia.filial_origem}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <div>
                      <div className={cn("text-xs", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-500")}>Responsável</div>
                      <div className={cn("font-medium", getTextClasses())}>{garantia.responsavel_envio}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className={cn("text-xs", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-500")}>Data Envio</div>
                      <div className={cn("font-medium", getTextClasses())}>
                        {new Date(garantia.data_envio).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className={cn("text-sm font-medium", getTextClasses())}>Fornecedor:</span>
                    <span className={cn(getTextClasses())}>{garantia.fornecedor}</span>
                  </div>
                  <div className={cn("text-sm", getTextClasses())}>
                    <span className="font-medium">Defeito:</span> {garantia.defeito}
                  </div>
                  {garantia.observacoes && (
                    <div className={cn("text-sm mt-2", getTextClasses())}>
                      <span className="font-medium">Observações:</span> {garantia.observacoes}
                    </div>
                  )}
                </div>

                {editingId === garantia.id ? (
                  <div className={cn("space-y-3 border-t pt-3", theme === 'dark-plus' && "dark-plus-border")}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className={cn(getLabelClasses())}>Novo Status</Label>
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as GarantiaToner['status'])}>
                          <SelectTrigger className={cn(getInputClasses())}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className={cn(theme === 'dark-plus' && "dark-plus-dialog")}>
                            <SelectItem value="Pendente" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Pendente</SelectItem>
                            <SelectItem value="Em Análise" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Em Análise</SelectItem>
                            <SelectItem value="Aguardando Toner Chegar no Laboratório" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Aguardando Toner Chegar no Laboratório</SelectItem>
                            <SelectItem value="Enviado para Fornecedor" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Enviado para Fornecedor</SelectItem>
                            <SelectItem value="Concluído" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className={cn(getLabelClasses())}>Destino Final</Label>
                        <Select value={destinoFinal} onValueChange={setDestinoFinal}>
                          <SelectTrigger className={cn(getInputClasses())}>
                            <SelectValue placeholder="Selecione o destino" />
                          </SelectTrigger>
                          <SelectContent className={cn(theme === 'dark-plus' && "dark-plus-dialog")}>
                            <SelectItem value="nao_definido" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Não definido</SelectItem>
                            <SelectItem value="Virou crédito" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Virou crédito</SelectItem>
                            <SelectItem value="Garantia expirada" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Garantia expirada</SelectItem>
                            <SelectItem value="Não era uma garantia válida" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Não era uma garantia válida</SelectItem>
                            <SelectItem value="Virou troca" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Virou troca</SelectItem>
                            <SelectItem value="Virou bonificação" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Virou bonificação</SelectItem>
                            <SelectItem value="Fornecedor consertou" className={cn(theme === 'dark-plus' && "dark-plus-hover dark-plus-text")}>Fornecedor consertou</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className={cn(getLabelClasses())}>Observações</Label>
                        <Textarea
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Observações adicionais..."
                          rows={2}
                          className={cn(getInputClasses())}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(garantia.id!)}
                        size="sm"
                        className={cn("bg-green-600 hover:bg-green-700", getButtonClasses())}
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
                        className={cn(getButtonClasses())}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={cn("border-t pt-3", theme === 'dark-plus' && "dark-plus-border")}>
                    <Button
                      onClick={() => {
                        setEditingId(garantia.id!);
                        setNewStatus(garantia.status);
                        setObservacoes(garantia.observacoes || '');
                        setDestinoFinal('');
                      }}
                      size="sm"
                      variant="outline"
                      className={cn(getButtonClasses())}
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
