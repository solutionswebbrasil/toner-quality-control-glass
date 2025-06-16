
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Download, Calendar, Building2, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { auditoriaService } from '@/services/auditoriaService';
import { fileUploadService } from '@/services/fileUploadService';
import type { Auditoria } from '@/types';

const unidades = [
  'Todas',
  'Matriz - São Paulo',
  'Filial Rio de Janeiro',
  'Filial Belo Horizonte',
  'Filial Brasília',
  'Filial Salvador',
  'Filial Recife',
  'Filial Fortaleza',
  'Filial Porto Alegre',
  'Filial Curitiba',
  'Filial Goiânia'
];

export const AuditoriaGrid: React.FC = () => {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('Todas');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAuditorias();
  }, []);

  useEffect(() => {
    filterAuditorias();
  }, [auditorias, dataInicio, dataFim, unidadeSelecionada]);

  const loadAuditorias = async () => {
    try {
      setIsLoading(true);
      const data = await auditoriaService.getAll();
      setAuditorias(data);
    } catch (error) {
      console.error('Erro ao carregar auditorias:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar auditorias. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAuditorias = () => {
    let filtered = [...auditorias];

    // Filtrar por data de início
    if (dataInicio) {
      filtered = filtered.filter(auditoria => auditoria.data_inicio >= dataInicio);
    }

    // Filtrar por data de fim
    if (dataFim) {
      filtered = filtered.filter(auditoria => auditoria.data_fim <= dataFim);
    }

    // Filtrar por unidade
    if (unidadeSelecionada !== 'Todas') {
      filtered = filtered.filter(auditoria => auditoria.unidade_auditada === unidadeSelecionada);
    }

    setFilteredAuditorias(filtered);
  };

  const handleDownloadPDF = async (auditoria: Auditoria) => {
    if (!auditoria.formulario_pdf) {
      toast({
        title: 'Arquivo não disponível',
        description: 'Esta auditoria não possui formulário anexado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Se a URL começa com http, é uma URL completa do Supabase Storage
      if (auditoria.formulario_pdf.startsWith('http')) {
        // Criar um link temporário para download
        const response = await fetch(auditoria.formulario_pdf);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `auditoria_${auditoria.id}_formulario.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpar o objeto URL
        window.URL.revokeObjectURL(url);
        
        toast({
          title: 'Download concluído',
          description: `Formulário da auditoria de ${auditoria.unidade_auditada} baixado com sucesso.`,
        });
      } else {
        toast({
          title: 'Erro no download',
          description: 'URL do arquivo inválida.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast({
        title: 'Erro no download',
        description: 'Erro ao baixar o arquivo. Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAuditoria = async (auditoria: Auditoria) => {
    try {
      setIsLoading(true);
      
      // Se existe PDF anexado, deletar do storage primeiro
      if (auditoria.formulario_pdf && auditoria.formulario_pdf.startsWith('http')) {
        await fileUploadService.deletePdf(auditoria.formulario_pdf);
      }
      
      const success = await auditoriaService.delete(auditoria.id);
      
      if (success) {
        // Atualizar a lista local
        setAuditorias(prev => prev.filter(a => a.id !== auditoria.id));
        
        toast({
          title: 'Sucesso',
          description: 'Auditoria excluída com sucesso.',
        });
      } else {
        throw new Error('Falha ao excluir auditoria');
      }
    } catch (error) {
      console.error('Erro ao excluir auditoria:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir auditoria. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('Todas');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Auditorias
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte, baixe os formulários e gerencie as auditorias realizadas
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data Início (a partir de)</Label>
              <Input
                id="data_inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data_fim">Data Fim (até)</Label>
              <Input
                id="data_fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Auditorias Encontradas ({filteredAuditorias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAuditorias.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Nenhuma auditoria encontrada com os filtros aplicados
            </div>
          ) : (
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
                  {filteredAuditorias.map((auditoria) => (
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPDF(auditoria)}
                            disabled={!auditoria.formulario_pdf || isLoading}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            {isLoading ? 'Baixando...' : 'Baixar PDF'}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a auditoria #{auditoria.id} da unidade {auditoria.unidade_auditada}?
                                  Esta ação não pode ser desfeita e todos os arquivos anexados serão removidos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAuditoria(auditoria)}
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
        </CardContent>
      </Card>
    </div>
  );
};
