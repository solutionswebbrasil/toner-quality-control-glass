
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
        const registrosData = await registroItPopService.getAllByTitulo(parseInt(tituloSelecionado));
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
            Visualizar IT/POP
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
          Visualizar IT/POP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visualize os registros de IT/POP por título
        </p>
      </div>

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
