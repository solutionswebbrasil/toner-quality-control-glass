
import React, { useState, useEffect } from 'react';
import { FileText, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface TituloItPop {
  id?: number;
  titulo: string;
  descricao?: string;
  data_cadastro: string;
}

interface ConsultaTitulosItPopProps {
  onSuccess: () => void;
}

// Mock data
const mockTitulos: TituloItPop[] = [
  {
    id: 1,
    titulo: 'Procedimento de Calibração',
    descricao: 'Procedimento para calibração de equipamentos',
    data_cadastro: new Date().toISOString()
  },
  {
    id: 2,
    titulo: 'IT - Manutenção Preventiva',
    descricao: 'Instrução técnica para manutenção preventiva',
    data_cadastro: new Date().toISOString()
  }
];

export const ConsultaTitulosItPop: React.FC<ConsultaTitulosItPopProps> = ({ onSuccess }) => {
  const [titulos, setTitulos] = useState<TituloItPop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTitulos();
  }, []);

  const carregarTitulos = async () => {
    try {
      console.log('🔍 Carregando títulos IT/POP (mock data)...');
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTitulos(mockTitulos);
      console.log('✅ Títulos carregados:', mockTitulos.length);
    } catch (error) {
      console.error('❌ Erro ao carregar títulos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar títulos. Tente recarregar a página.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirTitulo = async (titulo: TituloItPop) => {
    try {
      console.log('🗑️ Excluindo título (simulado):', titulo.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Sucesso',
        description: 'Título excluído com sucesso!',
      });
      
      // Remove from local state
      setTitulos(prev => prev.filter(t => t.id !== titulo.id));
      onSuccess();
    } catch (error) {
      console.error('❌ Erro ao excluir título:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir título. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Consulta de Títulos IT/POP
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
          Consulta de Títulos IT/POP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e gerencie os títulos cadastrados
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Títulos Cadastrados ({titulos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {titulos.length === 0 ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Nenhum título cadastrado ainda.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {titulos.map((titulo) => (
                    <TableRow key={titulo.id}>
                      <TableCell className="font-medium">{titulo.titulo}</TableCell>
                      <TableCell>{titulo.descricao || 'Sem descrição'}</TableCell>
                      <TableCell>{formatDate(titulo.data_cadastro)}</TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o título "{titulo.titulo}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleExcluirTitulo(titulo)}
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
