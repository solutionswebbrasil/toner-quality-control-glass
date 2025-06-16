import React, { useState, useEffect } from 'react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';
import { RetornadoFilters, RetornadoActions, RetornadoTable } from './retornado';

export const RetornadoGrid: React.FC = () => {
  const { toast } = useToast();
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  
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
      setRetornados(data);
    } catch (error) {
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
      // Criar CSV com encoding UTF-8 BOM para o Excel reconhecer corretamente
      const headers = ['id_cliente', 'modelo', 'filial', 'destino_final', 'peso', 'valor_recuperado', 'data_registro'];
      const exemploRow = ['12345', 'HP CF217A', 'Matriz', 'Estoque', '125.50', '25.50', '2024-06-16'];

      // Adicionar BOM para UTF-8 para garantir que o Excel abra corretamente
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        headers.join(';'), // Usar ponto e vírgula como separador para Excel brasileiro
        exemploRow.join(';')
      ].join('\r\n'); // Usar CRLF para compatibilidade com Windows/Excel

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'modelo_importacao_retornados.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Sucesso",
        description: "Modelo de planilha baixado com sucesso! Abra no Excel para editar.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar modelo de planilha.",
        variant: "destructive"
      });
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Arquivo deve conter pelo menos o cabeçalho e uma linha de dados');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const expectedHeaders = ['id_cliente', 'modelo', 'filial', 'destino_final', 'valor_recuperado', 'data_registro'];
      
      // Verificar se os cabeçalhos estão corretos
      if (!expectedHeaders.every(h => headers.includes(h))) {
        throw new Error('Cabeçalhos incorretos. Use o modelo de planilha fornecido.');
      }

      const dataLines = lines.slice(1);
      let importedCount = 0;
      let errorCount = 0;

      for (const line of dataLines) {
        try {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const data: any = {};
          
          headers.forEach((header, index) => {
            data[header] = values[index];
          });

          // Validar e converter dados
          const retornadoData = {
            id_cliente: parseInt(data.id_cliente),
            id_modelo: 1, // Valor padrão - seria ideal ter uma lookup table
            peso: 100, // Valor padrão
            destino_final: data.destino_final,
            filial: data.filial,
            valor_recuperado: data.valor_recuperado ? parseFloat(data.valor_recuperado) : undefined,
            data_registro: data.data_registro
          };

          await retornadoService.create(retornadoData);
          importedCount++;
        } catch (error) {
          console.error('Erro ao importar linha:', line, error);
          errorCount++;
        }
      }

      // Recarregar dados
      await loadRetornados();

      toast({
        title: "Importação Concluída",
        description: `${importedCount} registros importados com sucesso. ${errorCount > 0 ? `${errorCount} erros encontrados.` : ''}`,
      });

    } catch (error) {
      console.error('Erro na importação:', error);
      toast({
        title: "Erro na Importação",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      // Limpar o input
      event.target.value = '';
    }
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
    </div>
  );
};
