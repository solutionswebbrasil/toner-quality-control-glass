
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { registroItPopService, RegistroItPop } from '@/services/registroItPopService';
import { FileText, Trash2, Edit } from 'lucide-react';

interface ConsultaRegistrosItPopProps {
  onSuccess: () => void;
}

export const ConsultaRegistrosItPop: React.FC<ConsultaRegistrosItPopProps> = ({ onSuccess }) => {
  const [registros, setRegistros] = useState<RegistroItPop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadRegistros = async () => {
    try {
      const data = await registroItPopService.getAll();
      setRegistros(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar registros.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistros();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await registroItPopService.delete(id);
        toast({
          title: "Sucesso",
          description: "Registro excluído com sucesso!"
        });
        loadRegistros();
        onSuccess();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir registro.",
          variant: "destructive"
        });
      }
    }
  };

  const getPermissaoLabel = (permissao: string) => {
    return permissao === 'qualquer_pessoa' ? 'Qualquer pessoa' : 'Apenas setor';
  };

  const getPermissaoVariant = (permissao: string): "default" | "secondary" => {
    return permissao === 'qualquer_pessoa' ? 'default' : 'secondary';
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Registros POP/IT</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Data Upload</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>{registro.titulo}</TableCell>
                  <TableCell>{registro.setor_responsavel}</TableCell>
                  <TableCell>v{registro.versao}</TableCell>
                  <TableCell>
                    <Badge variant={getPermissaoVariant(registro.permissao_visualizacao)}>
                      {getPermissaoLabel(registro.permissao_visualizacao)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(registro.data_upload).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(registro.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
