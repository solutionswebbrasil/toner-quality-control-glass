
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { documentoVencimentoService, DocumentoVencimento } from '@/services/documentoVencimentoService';
import { FileText, Trash2, Edit } from 'lucide-react';

interface ConsultaDocumentosVencimentoProps {
  onSuccess: () => void;
}

export const ConsultaDocumentosVencimento: React.FC<ConsultaDocumentosVencimentoProps> = ({ onSuccess }) => {
  const [documentos, setDocumentos] = useState<DocumentoVencimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadDocumentos = async () => {
    try {
      const data = await documentoVencimentoService.getAll();
      setDocumentos(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar documentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentos();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        await documentoVencimentoService.delete(id);
        toast({
          title: "Sucesso",
          description: "Documento excluído com sucesso!"
        });
        loadDocumentos();
        onSuccess();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir documento.",
          variant: "destructive"
        });
      }
    }
  };

  const getDiasRestantes = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (diasRestantes: number) => {
    if (diasRestantes < 0) {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (diasRestantes <= 30) {
      return <Badge variant="secondary">Próximo ao vencimento</Badge>;
    } else {
      return <Badge variant="default">Vigente</Badge>;
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Documentos com Vencimento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Documento</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Dias Restantes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lembrete</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((documento) => {
                const diasRestantes = getDiasRestantes(documento.data_vencimento);
                return (
                  <TableRow key={documento.id}>
                    <TableCell>{documento.nome_documento}</TableCell>
                    <TableCell>{new Date(documento.data_vencimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{diasRestantes} dias</TableCell>
                    <TableCell>{getStatusBadge(diasRestantes)}</TableCell>
                    <TableCell>
                      {documento.receber_lembrete ? (
                        <Badge variant="outline">
                          {documento.dias_antes_lembrete} dias antes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(documento.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
