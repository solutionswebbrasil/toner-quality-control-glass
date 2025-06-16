import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { Retornado, RetornadoCSV } from '@/types';
import { retornadoService } from '@/services/dataService';
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
      const csvData: RetornadoCSV[] = filteredRetornados.map(item => ({
        id_cliente: item.id_cliente,
        modelo: item.modelo || '',
        destino_final: item.destino_final as RetornadoCSV['destino_final'],
        data_registro: new Date(item.data_registro).toISOString(), // Convert string back to Date for CSV
        filial: item.filial
      }));

      const headers = ['ID Cliente', 'Modelo', 'Destino Final', 'Data Registro', 'Filial'];
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => [
          row.id_cliente,
          `"${row.modelo}"`,
          `"${row.destino_final}"`,
          new Date(row.data_registro).toLocaleDateString('pt-BR'),
          `"${row.filial}"`
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
            <Button onClick={handleExportCSV} className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar CSV
            </Button>
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
                  <th className="text-left p-3 font-semibold">ID</th>
                  <th className="text-left p-3 font-semibold">Cliente</th>
                  <th className="text-left p-3 font-semibold">Modelo</th>
                  <th className="text-left p-3 font-semibold">Peso</th>
                  <th className="text-left p-3 font-semibold">Destino</th>
                  <th className="text-left p-3 font-semibold">Filial</th>
                  <th className="text-left p-3 font-semibold">Valor Recuperado</th>
                  <th className="text-left p-3 font-semibold">Data Registro</th>
                </tr>
              </thead>
              <tbody>
                {filteredRetornados.map((retornado) => (
                  <tr 
                    key={retornado.id} 
                    className="border-b border-white/10 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-3 font-medium">#{retornado.id}</td>
                    <td className="p-3">{retornado.id_cliente}</td>
                    <td className="p-3 font-medium">{retornado.modelo}</td>
                    <td className="p-3">{retornado.peso}g</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDestinoColor(retornado.destino_final)}`}>
                        {retornado.destino_final}
                      </span>
                    </td>
                    <td className="p-3">{retornado.filial}</td>
                    <td className="p-3">
                      {retornado.valor_recuperado ? `R$ ${retornado.valor_recuperado.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3">{new Date(retornado.data_registro).toLocaleDateString('pt-BR')}</td>
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
