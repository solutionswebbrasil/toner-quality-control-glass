
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HiEye, HiPencil, HiTrash, HiPrinter } from 'react-icons/hi';
import { NaoConformidade } from '@/types/naoConformidade';
import { format } from 'date-fns';

interface NaoConformidadeTableProps {
  naoConformidades: NaoConformidade[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onPrint: (id: number) => void;
}

export const NaoConformidadeTable: React.FC<NaoConformidadeTableProps> = ({
  naoConformidades,
  onView,
  onEdit,
  onDelete,
  onPrint
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Aberta':
        return 'destructive';
      case 'Em andamento':
        return 'secondary';
      case 'Corrigida':
        return 'default';
      case 'Recusada':
        return 'outline';
      case 'Reaberta':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getClassificacaoBadgeVariant = (classificacao: string) => {
    switch (classificacao) {
      case 'Leve':
        return 'outline';
      case 'Moderada':
        return 'secondary';
      case 'Grave':
        return 'destructive';
      case 'Crítica':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle>Não Conformidades Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {naoConformidades.map((nc) => (
                <TableRow key={nc.id}>
                  <TableCell className="font-medium">
                    NC-{String(nc.id).padStart(4, '0')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(nc.data_ocorrencia), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{nc.unidade_filial}</TableCell>
                  <TableCell>{nc.setor_responsavel}</TableCell>
                  <TableCell>{nc.tipo_nc}</TableCell>
                  <TableCell>
                    <Badge variant={getClassificacaoBadgeVariant(nc.classificacao)}>
                      {nc.classificacao}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(nc.status)}>
                      {nc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(nc.id!)}
                      >
                        <HiEye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(nc.id!)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPrint(nc.id!)}
                      >
                        <HiPrinter className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(nc.id!)}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
