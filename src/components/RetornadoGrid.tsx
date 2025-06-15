
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Retornado {
  id: number;
  modelo_toner: string;
  peso_retornado: number;
  percentual_restante: number;
  destino_final: string;
  observacoes: string;
  data_registro: string;
}

export const RetornadoGrid: React.FC = () => {
  const { toast } = useToast();
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRetornados();
  }, []);

  useEffect(() => {
    const filtered = retornados.filter(retornado =>
      retornado.modelo_toner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retornado.destino_final.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRetornados(filtered);
  }, [retornados, searchTerm]);

  const loadRetornados = async () => {
    try {
      // Dados de exemplo - substitua pela chamada real do serviço
      const mockData: Retornado[] = [
        {
          id: 1,
          modelo_toner: 'HP CF410A',
          peso_retornado: 580,
          percentual_restante: 75,
          destino_final: 'Estoque',
          observacoes: 'Boa qualidade',
          data_registro: '2024-06-15'
        },
        {
          id: 2,
          modelo_toner: 'Canon 045',
          peso_retornado: 340,
          percentual_restante: 15,
          destino_final: 'Descarte',
          observacoes: 'Qualidade ruim',
          data_registro: '2024-06-14'
        }
      ];
      
      setRetornados(mockData);
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

  const handleExport = () => {
    try {
      const csvContent = [
        ['Modelo', 'Peso', 'Percentual', 'Destino', 'Observações', 'Data'].join(','),
        ...filteredRetornados.map(r => [
          r.modelo_toner,
          r.peso_retornado,
          r.percentual_restante + '%',
          r.destino_final,
          r.observacoes,
          new Date(r.data_registro).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `retornados_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast({
        title: "Sucesso",
        description: "Dados exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar dados.",
        variant: "destructive"
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Info",
        description: "Funcionalidade de importação em desenvolvimento.",
      });
    }
  };

  const getDestinoColor = (destino: string) => {
    const colors = {
      'Estoque': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Descarte': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Manutencao': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[destino as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
      <h2 className="text-2xl font-bold">Consulta de Retornados</h2>
      
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Retornados Registrados
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Importar CSV
                </Button>
              </div>
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar retornados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 dark:border-slate-700/50">
                  <th className="text-left p-3 font-semibold">Modelo</th>
                  <th className="text-left p-3 font-semibold">Peso (g)</th>
                  <th className="text-left p-3 font-semibold">Percentual</th>
                  <th className="text-left p-3 font-semibold">Destino</th>
                  <th className="text-left p-3 font-semibold">Observações</th>
                  <th className="text-left p-3 font-semibold">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredRetornados.map((retornado) => (
                  <tr 
                    key={retornado.id} 
                    className="border-b border-white/10 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="p-3 font-medium">{retornado.modelo_toner}</td>
                    <td className="p-3">{retornado.peso_retornado}g</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        retornado.percentual_restante >= 80 ? 'bg-green-100 text-green-800' :
                        retornado.percentual_restante >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        retornado.percentual_restante >= 20 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {retornado.percentual_restante}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDestinoColor(retornado.destino_final)}`}>
                        {retornado.destino_final}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate" title={retornado.observacoes}>
                      {retornado.observacoes}
                    </td>
                    <td className="p-3">
                      {new Date(retornado.data_registro).toLocaleDateString('pt-BR')}
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
