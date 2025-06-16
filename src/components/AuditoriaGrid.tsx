
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Download, Calendar, Building2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
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

// Dados mock para demonstração - usando strings para datas
const mockAuditorias: Auditoria[] = [
  {
    id: 1,
    data_inicio: '2024-01-15',
    data_fim: '2024-01-17',
    unidade_auditada: 'Matriz - São Paulo',
    formulario_pdf: 'auditoria_matriz_jan2024.pdf',
    data_registro: '2024-01-18T00:00:00.000Z',
  },
  {
    id: 2,
    data_inicio: '2024-02-10',
    data_fim: '2024-02-12',
    unidade_auditada: 'Filial Rio de Janeiro',
    formulario_pdf: 'auditoria_rj_fev2024.pdf',
    data_registro: '2024-02-13T00:00:00.000Z',
  },
  {
    id: 3,
    data_inicio: '2024-03-05',
    data_fim: '2024-03-08',
    unidade_auditada: 'Filial Belo Horizonte',
    formulario_pdf: 'auditoria_bh_mar2024.pdf',
    data_registro: '2024-03-09T00:00:00.000Z',
  },
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
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuditorias(mockAuditorias);
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

  const handleDownloadPDF = (auditoria: Auditoria) => {
    if (auditoria.formulario_pdf) {
      // Simular download do PDF
      toast({
        title: 'Download iniciado',
        description: `Baixando formulário da auditoria de ${auditoria.unidade_auditada}`,
      });
      
      // Aqui você implementaria a lógica real de download
      // Por exemplo, fazer uma requisição para o backend para obter a URL do arquivo
      console.log('Downloading PDF:', auditoria.formulario_pdf);
    } else {
      toast({
        title: 'Arquivo não disponível',
        description: 'Esta auditoria não possui formulário anexado.',
        variant: 'destructive',
      });
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
          Consulte e baixe os formulários das auditorias realizadas
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(auditoria)}
                          disabled={!auditoria.formulario_pdf}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Baixar PDF
                        </Button>
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
