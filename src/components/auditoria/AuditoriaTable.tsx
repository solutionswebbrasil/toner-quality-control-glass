
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Building2, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AuditoriaActions } from './AuditoriaActions';
import type { Auditoria } from '@/types';

interface AuditoriaTableProps {
  auditorias: Auditoria[];
  isLoading: boolean;
  onDownloadPDF: (auditoria: Auditoria) => void;
  onDelete: (auditoria: Auditoria) => void;
}

export const AuditoriaTable: React.FC<AuditoriaTableProps> = ({
  auditorias,
  isLoading,
  onDownloadPDF,
  onDelete,
}) => {
  if (auditorias.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Nenhuma auditoria encontrada com os filtros aplicados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Data Fim</TableHead>
            <TableHead>Unidade Auditada</TableHead>
            <TableHead>Data Registro</TableHead>
            <TableHead>Formulário</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditorias.map((auditoria) => (
            <TableRow key={auditoria.id}>
              <TableCell className="font-medium">
                #{auditoria.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {format(new Date(auditoria.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {format(new Date(auditoria.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  {auditoria.unidade_auditada}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(auditoria.data_registro), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>
                {auditoria.formulario_pdf ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    PDF Disponível
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Sem arquivo
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <AuditoriaActions
                  auditoria={auditoria}
                  isLoading={isLoading}
                  onDownloadPDF={onDownloadPDF}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
