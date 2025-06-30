
import React, { useState, useEffect } from 'react';
import { Search, Trash2, Download, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { registroBpmnService } from '@/services/registroBpmnService';
import type { RegistroBpmn } from '@/types';

interface ConsultaRegistrosBpmnProps {
  onSuccess: () => void;
}

export const ConsultaRegistrosBpmn: React.FC<ConsultaRegistrosBpmnProps> = ({ onSuccess }) => {
  const [registros, setRegistros] = useState<RegistroBpmn[]>([]);
  const [filteredRegistros, setFilteredRegistros] = useState<RegistroBpmn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    carregarRegistros();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = registros.filter(registro =>
        registro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (registro.registrado_por && registro.registrado_por.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRegistros(filtered);
    } else {
      setFilteredRegistros(registros);
    }
  }, [searchTerm, registros]);

  const carregarRegistros = async () => {
    try {
      console.log('🔍 Carregando registros BPMN...');
      setLoading(true);
      const data = await registroBpmnService.getAll();
      setRegistros(data);
      console.log('✅ Registros BPMN carregados:', data.length);
    } catch (error) {
      console.error('❌ Erro ao carregar registros BPMN:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registros BPMN. Tente recarregar a página.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (registro: RegistroBpmn) => {
    if (!registro.id) return;

    try {
      console.log('🗑️ Iniciando exclusão do registro:', registro.titulo, 'Versão:', registro.versao);
      setDeletingId(registro.id);

      const sucesso = await registroBpmnService.delete(registro.id);
      
      if (sucesso) {
        console.log('✅ Registro excluído com sucesso');
        toast({
          title: 'Sucesso',
          description: 'Registro BPMN excluído com sucesso!',
        });
        await carregarRegistros();
        onSuccess();
      } else {
        throw new Error('Falha ao excluir registro');
      }
    } catch (error) {
      console.error('❌ Erro ao excluir registro:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir registro BPMN. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    console.log('📥 Iniciando download:', filename);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            BPMNs Cadastrados
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
          BPMNs Cadastrados
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e gerencie todos os diagramas BPMN em formato PNG
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Registros BPMN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Buscar por título ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {filteredRegistros.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  {searchTerm ? 'Nenhum registro encontrado com o termo pesquisado.' : 'Nenhum registro BPMN cadastrado.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Versão</TableHead>
                      <TableHead>Arquivo PNG</TableHead>
                      <TableHead>Registrado por</TableHead>
                      <TableHead>Data de Registro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistros.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell className="font-medium">{registro.titulo}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">v{registro.versao}</Badge>
                        </TableCell>
                        <TableCell>
                          {registro.arquivo_png ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(registro.arquivo_png!, `${registro.titulo}_v${registro.versao}.png`)}
                              className="text-xs"
                            >
                              <Image className="h-4 w-4" />
                              PNG
                            </Button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{registro.registrado_por || '-'}</TableCell>
                        <TableCell>{formatDate(registro.data_registro)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={deletingId === registro.id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o registro "{registro.titulo}" versão {registro.versao}?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(registro)}
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
