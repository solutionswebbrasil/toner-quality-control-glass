
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Trash2, Info } from 'lucide-react';
import { Retornado } from '@/types';

interface RetornadoTablePaginatedProps {
  retornados: Retornado[];
  onDelete: (id: number) => void;
  totalCount: number;
}

export const RetornadoTablePaginated: React.FC<RetornadoTablePaginatedProps> = ({
  retornados,
  onDelete,
  totalCount
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Exibir 50 itens por página
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = retornados.slice(startIndex, endIndex);

  const getDestinoColor = (destino: string) => {
    switch (destino) {
      case 'Descarte':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Garantia':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Estoque':
      case 'Estoque Semi Novo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Uso Interno':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calcularDetalhesRecuperacao = (retornado: any) => {
    if (!retornado.peso_vazio || !retornado.gramatura || !retornado.capacidade_folhas || !retornado.valor_por_folha) {
      return null;
    }

    const gramaturaRestante = retornado.peso - retornado.peso_vazio;
    const percentualGramatura = (gramaturaRestante / retornado.gramatura) * 100;
    const folhasRestantes = Math.round((percentualGramatura / 100) * retornado.capacidade_folhas);
    
    return {
      percentualGramatura: Math.max(0, percentualGramatura),
      folhasRestantes: Math.max(0, folhasRestantes),
      valorCalculado: Math.max(0, folhasRestantes * retornado.valor_por_folha)
    };
  };

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

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Retornados Encontrados</span>
          <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
            Página {currentPage} de {totalPages} | Total: {totalCount} registros
          </span>
        </CardTitle>
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
              {currentItems.map((retornado) => {
                const detalhes = calcularDetalhesRecuperacao(retornado);
                const isDestinationWithValue = retornado.destino_final === 'Estoque' || retornado.destino_final === 'Estoque Semi Novo';
                
                return (
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
                      {isDestinationWithValue && detalhes ? (
                        <div className="space-y-1">
                          <div className="font-medium text-green-600 dark:text-green-400">
                            R$ {detalhes.valorCalculado.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {detalhes.folhasRestantes.toLocaleString()} folhas ({detalhes.percentualGramatura.toFixed(1)}%)
                          </div>
                        </div>
                      ) : retornado.valor_recuperado ? (
                        `R$ ${retornado.valor_recuperado.toFixed(2)}`
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3">{new Date(retornado.data_registro).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {isDestinationWithValue && detalhes && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Detalhes do Valor Recuperado</AlertDialogTitle>
                                <AlertDialogDescription asChild>
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Peso atual:</span>
                                        <br />
                                        {retornado.peso}g
                                      </div>
                                      <div>
                                        <span className="font-medium">Peso vazio:</span>
                                        <br />
                                        {retornado.peso_vazio}g
                                      </div>
                                      <div>
                                        <span className="font-medium">Gramatura restante:</span>
                                        <br />
                                        {(retornado.peso - retornado.peso_vazio).toFixed(1)}g
                                      </div>
                                      <div>
                                        <span className="font-medium">Percentual:</span>
                                        <br />
                                        {detalhes.percentualGramatura.toFixed(1)}%
                                      </div>
                                      <div>
                                        <span className="font-medium">Folhas restantes:</span>
                                        <br />
                                        {detalhes.folhasRestantes.toLocaleString()} folhas
                                      </div>
                                      <div>
                                        <span className="font-medium">Valor por folha:</span>
                                        <br />
                                        R$ {retornado.valor_por_folha?.toFixed(4)}
                                      </div>
                                    </div>
                                    <div className="pt-3 border-t">
                                      <div className="text-lg font-semibold text-green-600">
                                        Valor Total Recuperado: R$ {detalhes.valorCalculado.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction>Fechar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
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
                                onClick={() => onDelete(retornado.id!)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {currentItems.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nenhum retornado encontrado.
            </div>
          )}
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
      </CardContent>
    </Card>
  );
};
