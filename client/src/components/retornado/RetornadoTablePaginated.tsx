
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface RetornadoTablePaginatedProps {
  data: Array<{
    id: number;
    modelo: string;
    peso: number;
    peso_vazio?: number;
    destino_final: string;
    valor_recuperado: number;
    filial: string;
    data_registro: string;
  }>;
  onViewDetails?: (id: number) => void;
}

export const RetornadoTablePaginated: React.FC<RetornadoTablePaginatedProps> = ({ 
  data, 
  onViewDetails 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const getDestinoColor = (destino: string) => {
    switch (destino) {
      case 'Estoque':
        return 'bg-green-100 text-green-800';
      case 'Garantia':
        return 'bg-yellow-100 text-yellow-800';
      case 'Descarte':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularGramaturaRestante = (peso: number, pesoVazio?: number) => {
    if (!pesoVazio) return 'N/A';
    const gramatura = Math.max(0, peso - pesoVazio);
    return `${gramatura.toFixed(1)}g`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Controles de Paginação Superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Mostrar</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">por página</span>
        </div>
        
        <div className="text-sm text-gray-600">
          Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length} registros
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Peso Total</TableHead>
              <TableHead>Gramatura Restante</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Valor Recuperado</TableHead>
              <TableHead>Filial</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((retornado) => (
              <TableRow key={retornado.id}>
                <TableCell className="font-medium">{retornado.id}</TableCell>
                <TableCell>{retornado.modelo}</TableCell>
                <TableCell>{retornado.peso.toFixed(1)}g</TableCell>
                <TableCell>{calcularGramaturaRestante(retornado.peso, retornado.peso_vazio)}</TableCell>
                <TableCell>
                  <Badge className={getDestinoColor(retornado.destino_final)}>
                    {retornado.destino_final}
                  </Badge>
                </TableCell>
                <TableCell>
                  {retornado.valor_recuperado > 0 
                    ? `R$ ${retornado.valor_recuperado.toFixed(2)}` 
                    : '-'
                  }
                </TableCell>
                <TableCell>{retornado.filial}</TableCell>
                <TableCell>
                  {new Date(retornado.data_registro).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {onViewDetails && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(retornado.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Controles de Paginação Inferior */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          {/* Números das páginas */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage);
                return distance <= 2 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 py-1 text-sm text-gray-500">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
