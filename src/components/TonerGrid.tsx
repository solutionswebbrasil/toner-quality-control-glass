
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import { Toner } from '@/types';
import { tonerService } from '@/services/tonerService';
import { useToast } from '@/hooks/use-toast';
import { TonerEditForm } from './TonerEditForm';

export const TonerGrid: React.FC = () => {
  const { toast } = useToast();
  const [toners, setToners] = useState<Toner[]>([]);
  const [filteredToners, setFilteredToners] = useState<Toner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingToner, setEditingToner] = useState<Toner | null>(null);

  useEffect(() => {
    loadToners();
  }, []);

  useEffect(() => {
    const filtered = toners.filter(toner =>
      toner.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toner.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toner.impressoras_compat.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredToners(filtered);
  }, [toners, searchTerm]);

  const loadToners = async () => {
    try {
      console.log('Carregando toners...');
      const data = await tonerService.getAll();
      console.log('Toners carregados:', data);
      setToners(data);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar toners.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (toner: Toner) => {
    setEditingToner(toner);
  };

  const handleEditSuccess = () => {
    setEditingToner(null);
    loadToners();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este toner? Esta ação pode falhar se existirem retornados vinculados a este toner.')) {
      try {
        console.log(`Tentando excluir toner com ID: ${id}`);
        const success = await tonerService.delete(id);
        
        if (success) {
          await loadToners();
          toast({
            title: "Sucesso",
            description: "Toner excluído com sucesso.",
          });
        } else {
          throw new Error('Falha na exclusão');
        }
      } catch (error: any) {
        console.error('Erro ao excluir toner:', error);
        
        let errorMessage = "Erro ao excluir toner.";
        
        // Verificar se é erro de chave estrangeira
        if (error.message && error.message.includes('foreign key')) {
          errorMessage = "Não é possível excluir este toner pois existem retornados vinculados a ele. Exclua primeiro os retornados relacionados.";
        } else if (error.message && error.message.includes('violates foreign key constraint')) {
          errorMessage = "Este toner não pode ser excluído pois está sendo usado em registros de retornados.";
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  if (editingToner) {
    return (
      <TonerEditForm
        toner={editingToner}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingToner(null)}
      />
    );
  }

  if (loading) {
    return (
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Carregando toners...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Consulta de Toners
          </span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar toners..."
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
                <th className="text-left p-3 font-semibold">Cor</th>
                <th className="text-left p-3 font-semibold">Peso Cheio</th>
                <th className="text-left p-3 font-semibold">Peso Vazio</th>
                <th className="text-left p-3 font-semibold">Gramatura</th>
                <th className="text-left p-3 font-semibold">Preço</th>
                <th className="text-left p-3 font-semibold">Capacidade</th>
                <th className="text-left p-3 font-semibold">Valor/Folha</th>
                <th className="text-left p-3 font-semibold">Data Registro</th>
                <th className="text-left p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredToners.map((toner) => (
                <tr 
                  key={toner.id} 
                  className="border-b border-white/10 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="p-3 font-medium">{toner.modelo}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      toner.cor === 'Preto' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
                      toner.cor === 'Ciano' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' :
                      toner.cor === 'Magenta' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {toner.cor}
                    </span>
                  </td>
                  <td className="p-3">{toner.peso_cheio}g</td>
                  <td className="p-3">{toner.peso_vazio}g</td>
                  <td className="p-3 font-medium text-blue-600 dark:text-blue-400">{toner.gramatura}g</td>
                  <td className="p-3">R$ {toner.preco_produto.toFixed(2)}</td>
                  <td className="p-3">{toner.capacidade_folhas.toLocaleString()}</td>
                  <td className="p-3 font-medium text-green-600 dark:text-green-400">R$ {toner.valor_por_folha.toFixed(4)}</td>
                  <td className="p-3">{new Date(toner.data_registro).toLocaleDateString('pt-BR')}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(toner)}
                        className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 dark:border-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toner.id && handleDelete(toner.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border-red-200 dark:border-red-800 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredToners.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nenhum toner encontrado.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
