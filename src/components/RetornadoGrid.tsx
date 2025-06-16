
import React, { useState, useEffect } from 'react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';
import { RetornadoFilters, RetornadoActions, RetornadoTable } from './retornado';
import { ImportModal } from './ImportModal';
import * as XLSX from 'xlsx';

export const RetornadoGrid: React.FC = () => {
  const { toast } = useToast();
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filialSelecionada, setFilialSelecionada] = useState('Todas');
  const [destinoSelecionado, setDestinoSelecionado] = useState('Todos');

  useEffect(() => {
    loadRetornados();
  }, []);

  useEffect(() => {
    filterRetornados();
  }, [retornados, dataInicio, dataFim, filialSelecionada, destinoSelecionado]);

  const loadRetornados = async () => {
    try {
      const data = await retornadoService.getAll();
      console.log('Retornados carregados:', data);
      setRetornados(data);
    } catch (error) {
      console.error('Erro ao carregar retornados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar retornados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRetornado = async (id: number) => {
    try {
      await retornadoService.delete(id);
      
      // Atualizar as listas localmente removendo o item excluído
      setRetornados(prev => prev.filter(item => item.id !== id));
      setFilteredRetornados(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Retornado excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir retornado:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir retornado.",
        variant: "destructive"
      });
    }
  };

  const filterRetornados = () => {
    let filtered = [...retornados];

    if (dataInicio) {
      filtered = filtered.filter(item => item.data_registro >= dataInicio);
    }

    if (dataFim) {
      filtered = filtered.filter(item => item.data_registro <= dataFim);
    }

    if (filialSelecionada !== 'Todas') {
      filtered = filtered.filter(item => item.filial === filialSelecionada);
    }

    if (destinoSelecionado !== 'Todos') {
      filtered = filtered.filter(item => item.destino_final === destinoSelecionado);
    }

    setFilteredRetornados(filtered);
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setFilialSelecionada('Todas');
    setDestinoSelecionado('Todos');
  };

  const handleExportCSV = () => {
    try {
      const headers = ['ID Cliente', 'Modelo', 'Filial', 'Destino Final', 'Valor Recuperado', 'Data Registro'];
      const csvContent = [
        headers.join(','),
        ...filteredRetornados.map(row => [
          row.id_cliente,
          `"${row.modelo || ''}"`,
          `"${row.filial}"`,
          `"${row.destino_final}"`,
          row.valor_recuperado || '',
          new Date(row.data_registro).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `retornados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Sucesso",
        description: "Arquivo CSV exportado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar CSV.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadTemplate = () => {
    try {
      const template = [
        { id_cliente: 12345, modelo: 'HP CF217A', filial: 'Matriz', destino_final: 'Estoque', peso: 125.50, valor_recuperado: 25.50, data_registro: '2024-06-16' }
      ];

      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Retornados');
      XLSX.writeFile(wb, 'template_importacao_retornados.xlsx');

      toast({
        title: "Sucesso",
        description: "Modelo de planilha baixado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar modelo de planilha.",
        variant: "destructive"
      });
    }
  };

  const handleImportUpload = async (data: any[]) => {
    setImporting(true);
    
    try {
      console.log('Iniciando importação com dados:', data);
      
      let importedCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const [index, item] of data.entries()) {
        try {
          console.log(`Processando item ${index + 1}:`, item);
          
          // Validação mais rigorosa dos dados
          if (!item.id_cliente || item.id_cliente <= 0) {
            throw new Error(`ID do cliente inválido: ${item.id_cliente}`);
          }
          
          if (!item.peso || item.peso <= 0) {
            throw new Error(`Peso inválido: ${item.peso}`);
          }

          // Normalizar e validar dados
          const retornadoData = {
            id_cliente: parseInt(String(item.id_cliente)) || 1,
            id_modelo: 1, // ID padrão - seria ideal ter uma lookup table
            peso: parseFloat(String(item.peso)) || 100,
            destino_final: String(item.destino_final || 'Estoque').trim(),
            filial: String(item.filial || 'Matriz').trim(),
            valor_recuperado: item.valor_recuperado ? parseFloat(String(item.valor_recuperado)) : null,
            data_registro: item.data_registro || new Date().toISOString().split('T')[0]
          };

          console.log(`Dados preparados para importação item ${index + 1}:`, retornadoData);
          
          const novoRetornado = await retornadoService.create(retornadoData);
          console.log(`Item ${index + 1} importado com sucesso:`, novoRetornado);
          
          importedCount++;
        } catch (error) {
          console.error(`Erro ao importar item ${index + 1}:`, item, error);
          errorCount++;
          errors.push(`Linha ${index + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      console.log(`Importação concluída: ${importedCount} sucessos, ${errorCount} erros`);
      
      // Recarregar dados após importação
      await loadRetornados();
      setIsImportModalOpen(false);

      if (errorCount > 0) {
        console.log('Erros encontrados:', errors);
        toast({
          title: "Importação Parcial",
          description: `${importedCount} registros importados. ${errorCount} erros encontrados. Verifique o console para detalhes.`,
          variant: errorCount > importedCount ? "destructive" : "default"
        });
      } else {
        toast({
          title: "Importação Concluída",
          description: `${importedCount} registros importados com sucesso!`,
        });
      }

    } catch (error) {
      console.error('Erro geral na importação:', error);
      toast({
        title: "Erro na Importação",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportCSV = () => {
    setIsImportModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Carregando retornados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Retornados
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e exporte dados dos toners retornados
        </p>
      </div>

      <RetornadoFilters
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        filialSelecionada={filialSelecionada}
        setFilialSelecionada={setFilialSelecionada}
        destinoSelecionado={destinoSelecionado}
        setDestinoSelecionado={setDestinoSelecionado}
        clearFilters={clearFilters}
        resultCount={filteredRetornados.length}
      />

      <div className="flex justify-end">
        <RetornadoActions
          onExportCSV={handleExportCSV}
          onDownloadTemplate={handleDownloadTemplate}
          onImportCSV={handleImportCSV}
          importing={importing}
        />
      </div>

      <RetornadoTable
        retornados={filteredRetornados}
        onDelete={handleDeleteRetornado}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onUpload={handleImportUpload}
        onDownloadTemplate={handleDownloadTemplate}
        title="Importar Planilha de Retornados"
        templateDescription="A planilha deve conter as colunas: id_cliente, modelo, filial, destino_final, peso, valor_recuperado, data_registro"
        requiredColumns={['id_cliente', 'peso']}
      />
    </div>
  );
};
