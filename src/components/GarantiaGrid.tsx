
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { garantiaService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Garantia } from '@/types';
import { Edit, Printer, FileText } from 'lucide-react';

export const GarantiaGrid: React.FC = () => {
  const { toast } = useToast();
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState<{ id: number; field: string } | null>(null);

  const loadGarantias = async () => {
    try {
      setIsLoading(true);
      const data = await garantiaService.getAll();
      setGarantias(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar garantias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGarantias();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await garantiaService.update(id, { status: newStatus as any });
      toast({
        title: "Sucesso!",
        description: "Status atualizado com sucesso.",
      });
      loadGarantias();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status.",
        variant: "destructive",
      });
    }
  };

  const handleResultadoChange = async (id: number, newResultado: string) => {
    try {
      await garantiaService.update(id, { resultado: newResultado as any });
      toast({
        title: "Sucesso!",
        description: "Resultado atualizado com sucesso.",
      });
      loadGarantias();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar resultado.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'aberta': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      'em_analise': 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
      'concluida': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      'recusada': 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
      'aguardando_fornecedor': 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'aberta': 'Aberta',
      'em_analise': 'Em Análise',
      'concluida': 'Concluída',
      'recusada': 'Recusada',
      'aguardando_fornecedor': 'Aguardando Fornecedor'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getResultadoLabel = (resultado: string) => {
    const labels = {
      'devolucao_credito': 'Devolução em Crédito',
      'trocado': 'Trocado',
      'consertado': 'Consertado'
    };
    return labels[resultado as keyof typeof labels] || resultado || 'Não definido';
  };

  const handlePrint = (garantia: Garantia) => {
    // Implementar funcionalidade de impressão
    toast({
      title: "Info",
      description: "Funcionalidade de impressão em desenvolvimento.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Consulta de Garantias</h2>
      
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Garantias Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-slate-500">Carregando...</div>
            </div>
          ) : garantias.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Nenhuma garantia registrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Defeito</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {garantias.map((garantia) => (
                    <TableRow key={garantia.id}>
                      <TableCell className="font-medium max-w-[200px] truncate" title={garantia.item}>
                        {garantia.item}
                      </TableCell>
                      <TableCell>{garantia.quantidade}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={garantia.defeito}>
                        {garantia.defeito}
                      </TableCell>
                      <TableCell>{garantia.fornecedor}</TableCell>
                      <TableCell>
                        <Select
                          value={garantia.status}
                          onValueChange={(value) => handleStatusChange(garantia.id!, value)}
                        >
                          <SelectTrigger className={`w-full ${getStatusColor(garantia.status)} border-0`}>
                            <SelectValue>
                              <span className="text-xs font-medium px-2 py-1 rounded-full">
                                {getStatusLabel(garantia.status)}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aberta">Aberta</SelectItem>
                            <SelectItem value="em_analise">Em Análise</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                            <SelectItem value="recusada">Recusada</SelectItem>
                            <SelectItem value="aguardando_fornecedor">Aguardando Fornecedor</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={garantia.resultado || ''}
                          onValueChange={(value) => handleResultadoChange(garantia.id!, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              <span className="text-xs">
                                {getResultadoLabel(garantia.resultado || '')}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Não definido</SelectItem>
                            <SelectItem value="devolucao_credito">Devolução em Crédito</SelectItem>
                            <SelectItem value="trocado">Trocado</SelectItem>
                            <SelectItem value="consertado">Consertado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>R$ {garantia.valor_unitario.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">R$ {garantia.valor_total.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(garantia.data_registro).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(garantia)}
                            className="p-2"
                            title="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2"
                            title="Ver Documentos"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
