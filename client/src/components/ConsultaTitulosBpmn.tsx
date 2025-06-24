
import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { tituloBpmnService } from '@/services/tituloBpmnService';
import { registroBpmnService } from '@/services/registroBpmnService';
import type { TituloBpmn } from '@/types';

interface ConsultaTitulosBpmnProps {
  onSuccess: () => void;
}

export const ConsultaTitulosBpmn: React.FC<ConsultaTitulosBpmnProps> = ({ onSuccess }) => {
  const [titulos, setTitulos] = useState<TituloBpmn[]>([]);
  const [filteredTitulos, setFilteredTitulos] = useState<TituloBpmn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    carregarTitulos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = titulos.filter(titulo =>
        titulo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (titulo.descricao && titulo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTitulos(filtered);
    } else {
      setFilteredTitulos(titulos);
    }
  }, [searchTerm, titulos]);

  const carregarTitulos = async () => {
    try {
      console.log('🔍 Carregando títulos BPMN...');
      setLoading(true);
      const data = await tituloBpmnService.getAll();
      setTitulos(data);
      console.log('✅ Títulos BPMN carregados:', data.length);
    } catch (error) {
      console.error('❌ Erro ao carregar títulos BPMN:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar títulos BPMN. Tente recarregar a página.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verificarRegistrosAssociados = async (tituloId: number): Promise<boolean> => {
    try {
      console.log('🔍 Verificando registros associados ao título:', tituloId);
      const registros = await registroBpmnService.getAllByTitulo(tituloId);
      console.log('📊 Registros encontrados:', registros.length);
      return registros.length > 0;
    } catch (error) {
      console.error('❌ Erro ao verificar registros:', error);
      return false;
    }
  };

  const handleDelete = async (titulo: TituloBpmn) => {
    if (!titulo.id) return;

    try {
      console.log('🗑️ Iniciando exclusão do título:', titulo.titulo);
      setDeletingId(titulo.id);

      // Verificar se existem registros associados
      const temRegistros = await verificarRegistrosAssociados(titulo.id);
      
      if (temRegistros) {
        toast({
          title: 'Não é possível excluir',
          description: 'Este título possui registros BPMN associados. Exclua os registros primeiro.',
          variant: 'destructive',
        });
        return;
      }

      const sucesso = await tituloBpmnService.delete(titulo.id);
      
      if (sucesso) {
        console.log('✅ Título excluído com sucesso');
        toast({
          title: 'Sucesso',
          description: 'Título BPMN excluído com sucesso!',
        });
        await carregarTitulos();
        onSuccess();
      } else {
        throw new Error('Falha ao excluir título');
      }
    } catch (error) {
      console.error('❌ Erro ao excluir título:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir título BPMN. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Consulta de Títulos BPMN
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando títulos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Títulos BPMN
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e gerencie os títulos BPMN cadastrados
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Títulos BPMN Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {filteredTitulos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  {searchTerm ? 'Nenhum título encontrado com o termo pesquisado.' : 'Nenhum título BPMN cadastrado.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTitulos.map((titulo) => (
                      <TableRow key={titulo.id}>
                        <TableCell className="font-medium">{titulo.titulo}</TableCell>
                        <TableCell>{titulo.descricao || '-'}</TableCell>
                        <TableCell>{formatDate(titulo.data_cadastro)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={deletingId === titulo.id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o título "{titulo.titulo}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(titulo)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
