
import React, { useState, useEffect } from 'react';
import { FileText, Trash2, AlertTriangle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { registroItPopService } from '@/services/registroItPopService';
import type { RegistroItPop } from '@/types';

interface ConsultaRegistrosItPopProps {
  onSuccess: () => void;
}

export const ConsultaRegistrosItPop: React.FC<ConsultaRegistrosItPopProps> = ({ onSuccess }) => {
  const [registros, setRegistros] = useState<RegistroItPop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRegistros();
  }, []);

  const carregarRegistros = async () => {
    try {
      console.log('🔍 Carregando todos os registros IT/POP...');
      setLoading(true);
      const registrosData = await registroItPopService.getAll();
      setRegistros(registrosData);
      console.log('✅ Registros carregados:', registrosData.length);
    } catch (error) {
      console.error('❌ Erro ao carregar registros:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registros. Tente recarregar a página.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirRegistro = async (registro: RegistroItPop) => {
    try {
      console.log('🗑️ Excluindo registro IT/POP:', registro.id);
      const sucesso = await registroItPopService.delete(registro.id!);
      
      if (sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Registro IT/POP excluído com sucesso!',
        });
        
        // Recarregar a lista de registros
        await carregarRegistros();
        onSuccess();
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao excluir registro. Tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao excluir registro:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir registro. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (arquivo: string) => {
    console.log('📥 Iniciando download do arquivo PDF:', arquivo);
    window.open(arquivo, '_blank');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            POP/ITs Cadastrados
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando registros...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          POP/ITs Cadastrados
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e gerencie todos os registros de IT/POP cadastrados
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros Cadastrados ({registros.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {registros.length === 0 ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Nenhum registro de IT/POP cadastrado ainda.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Versão</TableHead>
                    <TableHead>Data do Registro</TableHead>
                    <TableHead>Registrado por</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registros.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell className="font-medium">{registro.titulo}</TableCell>
                      <TableCell>
                        <Badge variant="outline">v{registro.versao}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(registro.data_registro)}</TableCell>
                      <TableCell>{registro.registrado_por || 'Não informado'}</TableCell>
                      <TableCell>
                        {registro.arquivo_pdf ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-red-500" />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(registro.arquivo_pdf!)}
                              className="p-0 h-auto text-blue-600 hover:text-blue-700"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">Sem arquivo</span>
                        )}
                      </TableCell>
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
                                Tem certeza que deseja excluir o registro "{registro.titulo} v{registro.versao}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleExcluirRegistro(registro)}
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
