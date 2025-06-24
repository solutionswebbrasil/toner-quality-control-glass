
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Retornado } from '@/types';

export interface RetornadoTablePaginatedProps {
  data: Retornado[];
  onDelete: (id: number) => Promise<void>;
  totalCount: number;
}

export const RetornadoTablePaginated: React.FC<RetornadoTablePaginatedProps> = ({
  data,
  onDelete,
  totalCount
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Peso (kg)</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Filial</TableHead>
              <TableHead>Valor Recuperado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((retornado) => (
              <TableRow key={retornado.id}>
                <TableCell className="font-medium">Modelo #{retornado.id_modelo}</TableCell>
                <TableCell>{retornado.peso.toFixed(2)}</TableCell>
                <TableCell>{retornado.destino_final}</TableCell>
                <TableCell>{retornado.filial}</TableCell>
                <TableCell>{formatCurrency(retornado.valor_recuperado || 0)}</TableCell>
                <TableCell>{formatDate(retornado.data_registro)}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Confirmar Exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este retornado? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => retornado.id && onDelete(retornado.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-600">
        Mostrando {data.length} de {totalCount} registros
      </div>
    </div>
  );
};
