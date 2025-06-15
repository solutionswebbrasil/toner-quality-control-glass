
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fornecedorService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Fornecedor } from '@/types';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { FornecedorForm } from './FornecedorForm';

export const FornecedorGrid: React.FC = () => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFornecedores = async () => {
    try {
      setIsLoading(true);
      const data = await fornecedorService.getAll();
      setFornecedores(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar fornecedores.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFornecedores();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;

    try {
      await fornecedorService.delete(id);
      toast({
        title: "Sucesso!",
        description: "Fornecedor excluído com sucesso.",
      });
      loadFornecedores();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir fornecedor.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
  };

  const handleEditSuccess = () => {
    setEditingFornecedor(null);
    loadFornecedores();
  };

  const handleEditCancel = () => {
    setEditingFornecedor(null);
  };

  if (editingFornecedor) {
    return (
      <FornecedorForm
        editingFornecedor={editingFornecedor}
        onSuccess={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Consulta de Fornecedores</h2>
      
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Fornecedores Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-slate-500">Carregando...</div>
            </div>
          ) : fornecedores.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Nenhum fornecedor cadastrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Fornecedor</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Link RMA</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedores.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.telefone}</TableCell>
                      <TableCell>
                        <a 
                          href={fornecedor.link_rma} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          RMA <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {new Date(fornecedor.data_cadastro).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(fornecedor)}
                            className="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(fornecedor.id!)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
