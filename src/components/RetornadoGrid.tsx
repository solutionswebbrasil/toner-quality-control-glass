
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Search, Download, Upload, FileSpreadsheet, Trash2 } from 'lucide-react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';

const filiais = [
  'Todas',
  'Matriz',
  'Filial 1',
  'Filial 2',
  'Filial 3',
  'Filial 4',
  'Filial 5'
];

const destinosFinais = [
  'Todos',
  'Descarte',
  'Garantia',
  'Estoque',
  'Uso Interno'
];

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
      const headers = ['id_cliente', 'modelo', 'filial', 'destino_final', 'valor_recuperado', 'data_registro'];
      const exampleRow = ['12345', 'HP CF217A', 'Matriz', 'Estoque', '25.50', '2024-06-16'];
      
      const csvContent = [
        headers.join(','),
        exampleRow.join(','),
        // Adicionar mais algumas linhas de exemplo
        '12346,"Canon 045","Filial 1","Garantia","30.00","2024-06-15"',
        '12347,"Brother TN-421","Filial 2","Descarte","0.00","2024-06-14"'
      ].join('\n');

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

  const getDestinoColor = (destino: string) => {
    switch (destino) {
      case 'Descarte':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Garantia':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Estoque':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Uso Interno':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Carregando retornados...</p>
        </CardContent>
      </Card>
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

      {/* Filtros */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data_fim">Data Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Filial</Label>
              <Select value={filialSelecionada} onValueChange={setFilialSelecionada}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filiais.map((filial) => (
                    <SelectItem key={filial} value={filial}>
                      {filial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destino Final</Label>
              <Select value={destinoSelecionado} onValueChange={setDestinoSelecionado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinosFinais.map((destino) => (
                    <SelectItem key={destino} value={destino}>
                      {destino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-y-2">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredRetornados.length} registro(s) encontrado(s)
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Baixar Modelo
              </Button>
              
              <label htmlFor="import-csv">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={importing}
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    {importing ? 'Importando...' : 'Importar CSV'}
                  </span>
                </Button>
              </label>
              <input
                id="import-csv"
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                disabled={importing}
              />
              
              <Button onClick={handleExportCSV} className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Retornados Encontrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 dark:border-slate-700/50">
                  <th className="text-left p-3 font-semibold">ID Cliente</th>
                  <th className="text-left p-3 font-semibold">Modelo</th>
                  <th className="text-left p-3 font-semibold">Filial</th>
                  <th className="text-left p-3 font-semibold">Destino Final</th>
                  <th className="text-left p-3 font-semibold">Valor Recuperado</th>
                  <th className="text-left p-3 font-semibold">Data Registro</th>
                  <th className="text-left p-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRetornados.map((retornado) => (
                  <tr 
                    key={retornado.id} 
                    className="border-b border-white/10 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-3 font-medium">{retornado.id_cliente}</td>
                    <td className="p-3">{retornado.modelo}</td>
                    <td className="p-3">{retornado.filial}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDestinoColor(retornado.destino_final)}`}>
                        {retornado.destino_final}
                      </span>
                    </td>
                    <td className="p-3">
                      {retornado.valor_recuperado ? `R$ ${retornado.valor_recuperado.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3">{new Date(retornado.data_registro).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este retornado (Cliente: {retornado.id_cliente})? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRetornado(retornado.id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRetornados.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Nenhum retornado encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
