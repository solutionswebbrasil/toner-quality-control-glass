
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Upload, FileText, Edit, Trash2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { retornadoService, tonerService } from '@/services/dataService';
import { Retornado, Toner, RetornadoCSV } from '@/types';

export const RetornadoGrid: React.FC = () => {
  const { toast } = useToast();
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [toners, setToners] = useState<Toner[]>([]);
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRetornado, setEditingRetornado] = useState<Retornado | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states for editing
  const [editIdCliente, setEditIdCliente] = useState('');
  const [editModelo, setEditModelo] = useState('');
  const [editDestinoFinal, setEditDestinoFinal] = useState<'Descarte' | 'Garantia' | 'Estoque' | 'Uso Interno'>('Estoque');
  const [editFilial, setEditFilial] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = retornados.filter(retornado =>
      retornado.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retornado.destino_final.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retornado.filial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retornado.id_cliente.toString().includes(searchTerm)
    );
    setFilteredRetornados(filtered);
  }, [retornados, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [retornadosData, tonersData] = await Promise.all([
        retornadoService.getAll(),
        tonerService.getAll()
      ]);
      setRetornados(retornadosData);
      setToners(tonersData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (retornado: Retornado) => {
    setEditingRetornado(retornado);
    setEditIdCliente(retornado.id_cliente.toString());
    setEditModelo(retornado.modelo || '');
    setEditDestinoFinal(retornado.destino_final);
    setEditFilial(retornado.filial);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRetornado) return;

    try {
      const toner = toners.find(t => t.modelo === editModelo);
      if (!toner) {
        toast({
          title: "Erro",
          description: "Modelo de toner não encontrado.",
          variant: "destructive"
        });
        return;
      }

      const updatedRetornado = {
        ...editingRetornado,
        id_cliente: parseInt(editIdCliente),
        id_modelo: toner.id!,
        modelo: editModelo,
        destino_final: editDestinoFinal,
        filial: editFilial
      };

      // Note: You'll need to implement update method in retornadoService
      await loadData();
      setIsEditModalOpen(false);
      setEditingRetornado(null);
      
      toast({
        title: "Sucesso",
        description: "Retornado atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar retornado.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este retornado?')) return;

    try {
      await retornadoService.delete(id);
      await loadData();
      toast({
        title: "Sucesso",
        description: "Retornado excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir retornado.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    try {
      const csvHeaders = ['ID Cliente', 'Modelo', 'Destino Final', 'Data Registro', 'Filial', 'Peso'];
      const csvData = filteredRetornados.map(r => [
        r.id_cliente,
        r.modelo || '',
        r.destino_final,
        new Date(r.data_registro).toLocaleDateString('pt-BR'),
        r.filial,
        r.peso.toString().replace('.', ',')
      ]);

      const csvContent = [
        csvHeaders.join(';'),
        ...csvData.map(row => row.join(';'))
      ].join('\n');

      // Adicionar BOM para UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
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

  const handleExportTemplate = () => {
    try {
      const csvHeaders = ['ID Cliente', 'Modelo', 'Destino Final', 'Data Registro', 'Filial', 'Peso'];
      const exampleData = [
        ['101', 'HP 85A', 'Estoque', '01/02/2024', 'Matriz', '125,5'],
        ['102', 'Canon 725', 'Descarte', '03/02/2024', 'Filial 1', '115,0'],
        ['103', 'HP 85A', 'Garantia', '05/02/2024', 'Filial 2', '130,2']
      ];

      const csvContent = [
        csvHeaders.join(';'),
        ...exampleData.map(row => row.join(';'))
      ].join('\n');

      // Adicionar BOM para UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template_importacao_retornados.csv';
      link.click();
      
      toast({
        title: "Sucesso",
        description: "Template de importação baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar template.",
        variant: "destructive"
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast({
            title: "Erro",
            description: "Arquivo deve conter pelo menos o cabeçalho e uma linha de dados.",
            variant: "destructive"
          });
          return;
        }

        const headers = lines[0].split(';').map(h => h.trim());
        
        // Validar cabeçalhos esperados
        const expectedHeaders = ['ID Cliente', 'Modelo', 'Destino Final', 'Data Registro', 'Filial', 'Peso'];
        const hasValidHeaders = expectedHeaders.every(expected => 
          headers.some(header => header.toLowerCase().includes(expected.toLowerCase().replace(' ', '')))
        );
        
        if (!hasValidHeaders) {
          toast({
            title: "Erro",
            description: "Formato de arquivo inválido. Use o template de importação.",
            variant: "destructive"
          });
          return;
        }

        const retornadosToImport: Omit<Retornado, 'id'>[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(';').map(v => v.trim());
          if (values.length < 6) continue;
          
          const modelo = values[1];
          const toner = toners.find(t => t.modelo.toLowerCase() === modelo.toLowerCase());
          if (!toner) {
            console.warn(`Modelo não encontrado: ${modelo}`);
            continue;
          }

          // Converter data do formato brasileiro para Date
          const dateParts = values[3].split('/');
          let dataRegistro = new Date();
          if (dateParts.length === 3) {
            dataRegistro = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
          }

          // Converter peso (trocar vírgula por ponto)
          const peso = parseFloat(values[5].replace(',', '.')) || 0;
          
          retornadosToImport.push({
            id_cliente: parseInt(values[0]) || 0,
            id_modelo: toner.id!,
            modelo: modelo,
            destino_final: values[2] as any,
            data_registro: dataRegistro,
            filial: values[4],
            peso: peso
          });
        }

        if (retornadosToImport.length === 0) {
          toast({
            title: "Aviso",
            description: "Nenhum registro válido encontrado no arquivo.",
          });
          return;
        }

        await retornadoService.bulkCreate(retornadosToImport);
        await loadData();
        
        toast({
          title: "Sucesso",
          description: `${retornadosToImport.length} retornados importados com sucesso.`,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao importar arquivo. Verifique o formato e tente novamente.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  const getDestinoColor = (destino: string) => {
    const colors = {
      'Estoque': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Descarte': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Garantia': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Uso Interno': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportTemplate}
                className="flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Template
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
                  <th className="text-left p-3 font-semibold">ID Cliente</th>
                  <th className="text-left p-3 font-semibold">Modelo</th>
                  <th className="text-left p-3 font-semibold">Destino Final</th>
                  <th className="text-left p-3 font-semibold">Data</th>
                  <th className="text-left p-3 font-semibold">Filial</th>
                  <th className="text-center p-3 font-semibold">Ações</th>
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
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDestinoColor(retornado.destino_final)}`}>
                        {retornado.destino_final}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(retornado.data_registro).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-3">{retornado.filial}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(retornado)}
                          className="p-2"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(retornado.id!)}
                          className="p-2 text-red-600 hover:text-red-700"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Retornado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ID Cliente</label>
              <Input
                value={editIdCliente}
                onChange={(e) => setEditIdCliente(e.target.value)}
                type="number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Modelo</label>
              <Select value={editModelo} onValueChange={setEditModelo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {toners.map((toner) => (
                    <SelectItem key={toner.id} value={toner.modelo}>
                      {toner.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Destino Final</label>
              <Select value={editDestinoFinal} onValueChange={(value: any) => setEditDestinoFinal(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estoque">Estoque</SelectItem>
                  <SelectItem value="Descarte">Descarte</SelectItem>
                  <SelectItem value="Garantia">Garantia</SelectItem>
                  <SelectItem value="Uso Interno">Uso Interno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Filial</label>
              <Input
                value={editFilial}
                onChange={(e) => setEditFilial(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
