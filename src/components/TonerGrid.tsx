
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Edit, Trash2, Eye, AlertTriangle, Package } from 'lucide-react';
import { Toner } from '@/types';
import { tonerService } from '@/services/tonerService';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';
import { TonerEditForm } from './TonerEditForm';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const TonerGrid: React.FC = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [toners, setToners] = useState<Toner[]>([]);
  const [filteredToners, setFilteredToners] = useState<Toner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingToner, setEditingToner] = useState<Toner | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const totalPages = Math.ceil(filteredToners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredToners.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page when filtering
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

  // Função aprimorada para verificar se o toner precisa ser atualizado
  const needsUpdate = (toner: Toner) => {
    return toner.registrado_por === 0 || 
           !toner.cor || 
           toner.cor.trim() === '' ||
           !toner.impressoras_compat || 
           toner.impressoras_compat.trim() === '' ||
           toner.peso_vazio === 0 || 
           toner.peso_cheio === 0 || 
           toner.gramatura === 0 || 
           toner.capacidade_folhas === 0 || 
           toner.preco_produto === 0;
  };

  // Contar toners que precisam de atualização
  const tonersNeedingUpdate = filteredToners.filter(needsUpdate).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Primeira página
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Ellipsis no início se necessário
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Páginas ao redor da atual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Ellipsis no final se necessário
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Última página
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
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
        <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-200">
          Consulta de Toners
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Gerencie os modelos de toners cadastrados no sistema
        </p>
      </div>

      {tonersNeedingUpdate > 0 && (
        <Card className="bg-yellow-50/50 dark:bg-yellow-900/10 backdrop-blur-xl border-yellow-200/50 dark:border-yellow-800/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1 text-yellow-800 dark:text-yellow-200">
                  Toners pendentes de atualização
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {tonersNeedingUpdate} toner(s) foram criados automaticamente durante a importação e precisam ter seus dados atualizados. 
                  Eles estão indicados com o ícone de alerta na tabela abaixo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Lista de Toners ({filteredToners.length})
              {tonersNeedingUpdate > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                  {tonersNeedingUpdate} pendentes
                </span>
              )}
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
              <p className="text-lg text-slate-500">
                {searchTerm ? 'Nenhum toner encontrado com os critérios de busca.' : 'Nenhum toner cadastrado ainda.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Página {currentPage} de {totalPages} | Mostrando {currentItems.length} de {filteredToners.length} toners
              </div>
              
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
                    {currentItems.map((toner) => {
                      const needsUpdateFlag = needsUpdate(toner);
                      return (
                        <tr 
                          key={toner.id} 
                          className={cn(
                            "border-b transition-colors border-white/10 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/20",
                            needsUpdateFlag && "border-orange-300 dark:border-orange-600"
                          )}
                        >
                          <td className="p-3 font-medium">
                            <div className="flex items-center gap-2">
                              {toner.modelo}
                              {needsUpdateFlag && (
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {toner.cor ? (
                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", 
                                toner.cor === 'Preto' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
                                toner.cor === 'Ciano' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' :
                                toner.cor === 'Magenta' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              )}>
                                {toner.cor}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Não informado</span>
                            )}
                          </td>
                          <td className="p-3">{toner.peso_cheio || 0}g</td>
                          <td className="p-3">{toner.peso_vazio || 0}g</td>
                          <td className="p-3 font-medium text-blue-600 dark:text-blue-400">{toner.gramatura || 0}g</td>
                          <td className="p-3">R$ {(toner.preco_produto || 0).toFixed(2)}</td>
                          <td className="p-3">{(toner.capacidade_folhas || 0).toLocaleString()}</td>
                          <td className="p-3 font-medium text-green-600 dark:text-green-400">R$ {(toner.valor_por_folha || 0).toFixed(4)}</td>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {filteredToners.length > 0 && (
        <Card className="bg-orange-50/50 dark:bg-orange-900/10 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1 text-orange-800 dark:text-orange-200">
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
