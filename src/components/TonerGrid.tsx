
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash2, Eye, AlertTriangle, Package } from 'lucide-react';
import { Toner } from '@/types';
import { tonerService } from '@/services/tonerService';
import { retornadoService } from '@/services/retornadoService';
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

  const checkRetornadosVinculados = async (tonerId: number): Promise<boolean> => {
    try {
      const retornados = await retornadoService.getAll();
      return retornados.some(retornado => retornado.id_modelo === tonerId);
    } catch (error) {
      console.error('Erro ao verificar retornados:', error);
      return false;
    }
  };

  const handleDelete = async (id: number, modelo: string) => {
    // Primeiro verifica se há retornados vinculados
    const temRetornados = await checkRetornadosVinculados(id);
    
    if (temRetornados) {
      toast({
        title: "Não é possível excluir",
        description: `O toner "${modelo}" não pode ser excluído porque existem registros de retornados vinculados a ele. Para excluir este toner, primeiro você precisa excluir todos os retornados que usam este modelo.`,
        variant: "destructive"
      });
      return;
    }

    const confirmMessage = `Tem certeza que deseja excluir o toner "${modelo}"? Esta ação não pode ser desfeita.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log(`Tentando excluir toner com ID: ${id}`);
        const success = await tonerService.delete(id);
        
        if (success) {
          await loadToners();
          toast({
            title: "Sucesso",
            description: `Toner "${modelo}" excluído com sucesso.`,
          });
        } else {
          throw new Error('Falha na exclusão');
        }
      } catch (error: any) {
        console.error('Erro ao excluir toner:', error);
        
        let errorMessage = "Erro inesperado ao excluir toner.";
        
        if (error.code === '23503' || error.message?.includes('foreign key')) {
          errorMessage = `Não é possível excluir o toner "${modelo}" porque existem retornados vinculados a ele. Acesse a seção "Retornados" e exclua primeiro os registros que usam este toner.`;
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Toners
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Gerencie os modelos de toners cadastrados no sistema
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Lista de Toners ({filteredToners.length})
            </span>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por modelo, cor ou impressora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredToners.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                {searchTerm ? 'Nenhum toner encontrado com os critérios de busca.' : 'Nenhum toner cadastrado ainda.'}
              </p>
            </div>
          ) : (
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
                            className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 dark:border-blue-800 text-blue-700 hover:text-blue-800"
                            title="Editar toner"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toner.id && handleDelete(toner.id, toner.modelo)}
                            className="bg-red-500/10 hover:bg-red-500/20 border-red-200 dark:border-red-800 text-red-600 hover:text-red-700"
                            title="Excluir toner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredToners.length > 0 && (
        <Card className="bg-orange-50/50 dark:bg-orange-900/10 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Importante sobre exclusão de toners
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Um toner só pode ser excluído se não houver registros de retornados vinculados a ele. 
                  Se você tentar excluir um toner que está sendo usado, o sistema mostrará uma mensagem explicativa.
                  Para excluir um toner, primeiro exclua todos os retornados que o referenciam.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
