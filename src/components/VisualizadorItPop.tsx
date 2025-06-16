
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { tituloItPopService } from '@/services/tituloItPopService';
import { registroItPopService } from '@/services/registroItPopService';
import type { TituloItPop, RegistroItPop } from '@/types';

interface VisualizadorItPopProps {
  onSuccess: () => void;
}

export const VisualizadorItPop: React.FC<VisualizadorItPopProps> = ({ onSuccess }) => {
  const [tituloSelecionado, setTituloSelecionado] = useState<string>('');
  const [titulos, setTitulos] = useState<TituloItPop[]>([]);
  const [registros, setRegistros] = useState<RegistroItPop[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegistros, setLoadingRegistros] = useState(false);

  useEffect(() => {
    carregarTitulos();
  }, []);

  useEffect(() => {
    const carregarRegistros = async () => {
      if (!tituloSelecionado) {
        setRegistros([]);
        return;
      }

      try {
        console.log('🔍 Carregando registros para título ID:', tituloSelecionado);
        setLoadingRegistros(true);
        const registrosData = await registroItPopService.getByTituloId(parseInt(tituloSelecionado));
        setRegistros(registrosData);
        console.log('✅ Registros carregados:', registrosData.length);
      } catch (error) {
        console.error('❌ Erro ao carregar registros:', error);
      } finally {
        setLoadingRegistros(false);
      }
    };

    carregarRegistros();
  }, [tituloSelecionado]);

  const carregarTitulos = async () => {
    try {
      console.log('🔍 Carregando títulos IT/POP...');
      setLoading(true);
      const titulosData = await tituloItPopService.getAll();
      setTitulos(titulosData);
      console.log('✅ Títulos carregados:', titulosData.length);
    } catch (error) {
      console.error('❌ Erro ao carregar títulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirTitulo = async (titulo: TituloItPop) => {
    try {
      console.log('🔍 Verificando se existem registros para o título:', titulo.id);
      
      // Verificar se existem registros para este título
      const registrosDoTitulo = await registroItPopService.getByTituloId(titulo.id!);
      
      if (registrosDoTitulo.length > 0) {
        toast({
          title: 'Não é possível excluir',
          description: `Este título possui ${registrosDoTitulo.length} registro(s) de IT/POP. Exclua primeiro os registros antes de excluir o título.`,
          variant: 'destructive',
        });
        return;
      }

      console.log('🗑️ Excluindo título:', titulo.id);
      const sucesso = await tituloItPopService.delete(titulo.id!);
      
      if (sucesso) {
        toast({
          title: 'Sucesso',
          description: 'Título excluído com sucesso!',
        });
        
        // Recarregar a lista de títulos
        await carregarTitulos();
        
        // Limpar seleção se o título excluído estava selecionado
        if (tituloSelecionado === titulo.id!.toString()) {
          setTituloSelecionado('');
          setRegistros([]);
        }
        
        onSuccess();
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao excluir título. Tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao excluir título:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir título. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (arquivo: string, tipo: string) => {
    console.log(`📥 Iniciando download do arquivo ${tipo}:`, arquivo);
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
            Consultar IT/POP
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando dados...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consultar IT/POP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e gerencie títulos e registros de IT/POP
        </p>
      </div>

      {/* Lista de Títulos */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Títulos Cadastrados
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
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {titulos.map((titulo) => (
                    <TableRow key={titulo.id}>
                      <TableCell className="font-medium">{titulo.titulo}</TableCell>
                      <TableCell>{titulo.descricao || 'Sem descrição'}</TableCell>
                      <TableCell>{formatDate(titulo.data_cadastro)}</TableCell>
                      <TableCell>
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
                                {registros.length > 0 && tituloSelecionado === titulo.id!.toString() && (
                                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300">
                                    ⚠️ Este título possui registros associados e não pode ser excluído.
                                  </div>
                                )}
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

      {/* Seleção e Visualização de Registros */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visualizar Registros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Selecione um Título</label>
            <Select onValueChange={setTituloSelecionado} value={tituloSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o título" />
              </SelectTrigger>
              <SelectContent>
                {titulos.map((titulo) => (
                  <SelectItem key={titulo.id} value={titulo.id!.toString()}>
                    {titulo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingRegistros && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Carregando registros...
            </div>
          )}

          {!loadingRegistros && registros.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {registros[0]?.titulo} - {registros.length} versão(s) encontrada(s)
                </h3>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Versão</TableHead>
                      <TableHead>Data do Registro</TableHead>
                      <TableHead>Registrado por</TableHead>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell>
                          <Badge variant={registro.versao === registros[0].versao ? "default" : "secondary"}>
                            v{registro.versao}
                            {registro.versao === registros[0].versao && " (Atual)"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(registro.data_registro)}
                        </TableCell>
                        <TableCell>
                          {registro.registrado_por || 'Não informado'}
                        </TableCell>
                        <TableCell>
                          {registro.arquivo_pdf ? (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-red-500" />
                              <span>PDF</span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">Sem arquivo</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {registro.arquivo_pdf && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(registro.arquivo_pdf!, 'PDF')}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Baixar PDF
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!loadingRegistros && tituloSelecionado && registros.length === 0 && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Nenhum registro encontrado para este título.
            </div>
          )}

          {!tituloSelecionado && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Selecione um título para visualizar os registros.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
