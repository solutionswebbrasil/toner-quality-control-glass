
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface RetornadoTableProps {
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

export const RetornadoTable: React.FC<RetornadoTableProps> = ({ data, onViewDetails }) => {
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

  return (
    <div className="overflow-x-auto">
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
          {data.map((retornado) => (
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
  );
};
