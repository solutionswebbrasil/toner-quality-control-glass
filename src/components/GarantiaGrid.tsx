import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { garantiaService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Garantia } from '@/types';
import { Edit, Printer, FileText, Trash2, Download, Eye, CalendarIcon } from 'lucide-react';
import { GarantiaEditForm } from './GarantiaEditForm';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

// Função para normalizar valores removendo acentos e caracteres especiais
const normalizeValue = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais exceto espaços
    .replace(/\s+/g, '_') // Substitui espaços por underscore
    .replace(/\t/g, '') // Remove tabs
    .trim();
};

export const GarantiaGrid: React.FC = () => {
  const { toast } = useToast();
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [filteredGarantias, setFilteredGarantias] = useState<Garantia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGarantia, setEditingGarantia] = useState<Garantia | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const loadGarantias = async () => {
    try {
      setIsLoading(true);
      const data = await garantiaService.getAll();
      setGarantias(data);
      setFilteredGarantias(data);
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

  useEffect(() => {
    // Filtrar garantias baseado nas datas selecionadas
    let filtered = garantias;
    
    if (startDate && endDate) {
      filtered = garantias.filter(garantia => {
        const garantiaDate = new Date(garantia.data_registro);
        return garantiaDate >= startDate && garantiaDate <= endDate;
      });
    }
    
    setFilteredGarantias(filtered);
  }, [startDate, endDate, garantias]);

  const exportToExcel = () => {
    if (filteredGarantias.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para exportar no período selecionado.",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados para exportação
    const exportData = filteredGarantias.map(garantia => ({
      'Item': garantia.item,
      'Quantidade': garantia.quantidade,
      'Defeito': garantia.defeito,
      'Fornecedor': garantia.fornecedor,
      'Status': getStatusLabel(garantia.status),
      'Resultado': getResultadoLabel(garantia.resultado || ''),
      'Valor Unitário': `R$ ${garantia.valor_unitario.toFixed(2)}`,
      'Valor Total': `R$ ${garantia.valor_total.toFixed(2)}`,
      'Data de Registro': new Date(garantia.data_registro).toLocaleDateString('pt-BR'),
      'NF Compra': garantia.nf_compra_pdf ? 'Anexado' : 'Não anexado',
      'NF Remessa': garantia.nf_remessa_pdf ? 'Anexado' : 'Não anexado',
      'NF Devolução': garantia.nf_devolucao_pdf ? 'Anexado' : 'Não anexado'
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 25 }, // Item
      { wch: 10 }, // Quantidade
      { wch: 20 }, // Defeito
      { wch: 20 }, // Fornecedor
      { wch: 15 }, // Status
      { wch: 15 }, // Resultado
      { wch: 12 }, // Valor Unitário
      { wch: 12 }, // Valor Total
      { wch: 12 }, // Data
      { wch: 12 }, // NF Compra
      { wch: 12 }, // NF Remessa
      { wch: 12 }  // NF Devolução
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Garantias');

    // Gerar nome do arquivo com período
    let fileName = 'relatorio-garantias';
    if (startDate && endDate) {
      const start = format(startDate, 'dd-MM-yyyy');
      const end = format(endDate, 'dd-MM-yyyy');
      fileName += `-${start}-${end}`;
    }
    fileName += '.xlsx';

    // Fazer download
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Sucesso!",
      description: "Relatório exportado com sucesso.",
    });
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

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
      const resultadoValue = newResultado === 'nao_definido' ? '' : newResultado;
      await garantiaService.update(id, { resultado: resultadoValue as any });
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

  const handleEdit = (garantia: Garantia) => {
    setEditingGarantia(garantia);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta garantia?')) return;

    try {
      await garantiaService.delete(id);
      toast({
        title: "Sucesso!",
        description: "Garantia excluída com sucesso.",
      });
      loadGarantias();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir garantia.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = (garantia: Garantia) => {
    // Criar uma janela de impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Garantia - ${garantia.item}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .info { margin-bottom: 20px; }
              .label { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Garantia</h1>
              <p>Data de Impressão: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="info">
              <p><span class="label">Item:</span> ${garantia.item}</p>
              <p><span class="label">Quantidade:</span> ${garantia.quantidade}</p>
              <p><span class="label">Defeito:</span> ${garantia.defeito}</p>
              <p><span class="label">Fornecedor:</span> ${garantia.fornecedor}</p>
              <p><span class="label">Status:</span> ${garantia.status}</p>
              <p><span class="label">Resultado:</span> ${garantia.resultado || 'Não definido'}</p>
              <p><span class="label">Valor Unitário:</span> R$ ${garantia.valor_unitario.toFixed(2)}</p>
              <p><span class="label">Valor Total:</span> R$ ${garantia.valor_total.toFixed(2)}</p>
              <p><span class="label">Data de Registro:</span> ${new Date(garantia.data_registro).toLocaleDateString('pt-BR')}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleViewPdf = (pdfUrl: string, fileName: string) => {
    if (!pdfUrl) {
      toast({
        title: "Erro",
        description: "Arquivo não encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    window.open(pdfUrl, '_blank');
  };

  const handleDownloadPdf = async (pdfUrl: string, fileName: string) => {
    if (!pdfUrl) {
      toast({
        title: "Erro",
        description: "Arquivo não encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar arquivo.",
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
      'aguardando_fornecedor': 'Aguardando Fornecedor',
      'aguardando_chegar_em_laboratorio': 'Aguardando Chegar em Laboratório',
      'aguardando_envio_para_fornecedor': 'Aguardando Envio para Fornecedor'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getResultadoLabel = (resultado: string) => {
    const labels = {
      'nao_definido': 'Não definido',
      'devolucao_em_credito': 'Devolução em Crédito',
      'trocado': 'Trocado',
      'consertado': 'Consertado'
    };
    return labels[resultado as keyof typeof labels] || resultado || 'Não definido';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Consulta de Garantias</h2>
      
      {/* Filtros de Data e Exportação */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Selecione um período para exportar relatório em Excel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Inicial:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data Final:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>

            <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
          
          {startDate && endDate && (
            <div className="mt-4 text-sm text-slate-600">
              Período selecionado: {format(startDate, "dd/MM/yyyy")} até {format(endDate, "dd/MM/yyyy")} 
              ({filteredGarantias.length} registros encontrados)
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Garantias Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-slate-500">Carregando...</div>
            </div>
          ) : filteredGarantias.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {startDate && endDate ? 
                "Nenhuma garantia encontrada no período selecionado." : 
                "Nenhuma garantia registrada."
              }
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
                    <TableHead>NF Compra</TableHead>
                    <TableHead>NF Remessa</TableHead>
                    <TableHead>NF Devolução</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGarantias.map((garantia) => (
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
                            <SelectItem value="aguardando_chegar_em_laboratorio">Aguardando Chegar em Laboratório</SelectItem>
                            <SelectItem value="aguardando_envio_para_fornecedor">Aguardando Envio para Fornecedor</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={garantia.resultado || 'nao_definido'}
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
                            <SelectItem value="nao_definido">Não definido</SelectItem>
                            <SelectItem value="devolucao_em_credito">Devolução em Crédito</SelectItem>
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
                      
                      {/* NF Compra */}
                      <TableCell>
                        {garantia.nf_compra_pdf ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPdf(garantia.nf_compra_pdf!, `NF_Compra_${garantia.id}.pdf`)}
                              className="p-1"
                              title="Visualizar NF Compra"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPdf(garantia.nf_compra_pdf!, `NF_Compra_${garantia.id}.pdf`)}
                              className="p-1"
                              title="Baixar NF Compra"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Não anexado</span>
                        )}
                      </TableCell>
                      
                      {/* NF Remessa */}
                      <TableCell>
                        {garantia.nf_remessa_pdf ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPdf(garantia.nf_remessa_pdf!, `NF_Remessa_${garantia.id}.pdf`)}
                              className="p-1"
                              title="Visualizar NF Remessa"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPdf(garantia.nf_remessa_pdf!, `NF_Remessa_${garantia.id}.pdf`)}
                              className="p-1"
                              title="Baixar NF Remessa"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Não anexado</span>
                        )}
                      </TableCell>
                      
                      {/* NF Devolução */}
                      <TableCell>
                        {garantia.nf_devolucao_pdf ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPdf(garantia.nf_devolucao_pdf!, `NF_Devolucao_${garantia.id}.pdf`)}
                              className="p-1"
                              title="Visualizar NF Devolução"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPdf(garantia.nf_devolucao_pdf!, `NF_Devolucao_${garantia.id}.pdf`)}
                              className="p-1"
                              title="Baixar NF Devolução"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Não anexado</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(garantia)}
                            className="p-2"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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
                            onClick={() => handleDelete(garantia.id!)}
                            className="p-2 text-red-600 hover:text-red-700"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <GarantiaEditForm
        garantia={editingGarantia}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGarantia(null);
        }}
        onSuccess={loadGarantias}
      />
    </div>
  );
};
