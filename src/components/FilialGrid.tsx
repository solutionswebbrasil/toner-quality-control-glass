
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, AlertTriangle } from 'lucide-react';
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
import { filialService } from '@/services/filialService';
import { useToast } from '@/hooks/use-toast';
import type { Filial } from '@/types/filial';

export const FilialGrid: React.FC = () => {
  const { toast } = useToast();
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiliais();
  }, []);

  const loadFiliais = async () => {
    try {
      const data = await filialService.getAll();
      setFiliais(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar filiais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFilial = async (id: number, nome: string) => {
    try {
      await filialService.delete(id);
      
      // Atualizar lista removendo o item excluído
      setFiliais(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Sucesso",
        description: `Filial "${nome}" excluída com sucesso!`,
      });
    } catch (error) {
      console.error('Erro ao excluir filial:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir filial.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Carregando filiais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Filiais
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visualize e gerencie as filiais cadastradas
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Filiais Cadastradas ({filiais.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filiais.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">
                Nenhuma filial cadastrada.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filiais.map((filial) => (
                    <TableRow key={filial.id}>
                      <TableCell className="font-medium">{filial.nome}</TableCell>
                      <TableCell>{filial.codigo || '-'}</TableCell>
                      <TableCell>{filial.endereco || '-'}</TableCell>
                      <TableCell>{filial.telefone || '-'}</TableCell>
                      <TableCell>{filial.email || '-'}</TableCell>
                      <TableCell>
                        {new Date(filial.data_cadastro).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a filial "{filial.nome}"?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFilial(filial.id, filial.nome)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
