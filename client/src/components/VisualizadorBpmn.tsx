
import React, { useState, useEffect } from 'react';
import { Eye, Download, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { tituloBpmnService } from '@/services/tituloBpmnService';
import { registroBpmnService } from '@/services/registroBpmnService';
import type { TituloBpmn, RegistroBpmn } from '@/types';

interface VisualizadorBpmnProps {
  onSuccess: () => void;
}

export const VisualizadorBpmn: React.FC<VisualizadorBpmnProps> = ({ onSuccess }) => {
  const [titulos, setTitulos] = useState<TituloBpmn[]>([]);
  const [registros, setRegistros] = useState<RegistroBpmn[]>([]);
  const [tituloSelecionado, setTituloSelecionado] = useState<string>('');
  const [registroSelecionado, setRegistroSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingRegistros, setLoadingRegistros] = useState(false);

  useEffect(() => {
    carregarTitulos();
  }, []);

  useEffect(() => {
    if (tituloSelecionado) {
      carregarRegistrosPorTitulo(parseInt(tituloSelecionado));
    } else {
      setRegistros([]);
      setRegistroSelecionado('');
    }
  }, [tituloSelecionado]);

  const carregarTitulos = async () => {
    try {
      console.log('🔍 Carregando títulos BPMN...');
      setLoading(true);
      const data = await tituloBpmnService.getAll();
      setTitulos(data);
      console.log('✅ Títulos carregados:', data.length);
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

  const carregarRegistrosPorTitulo = async (tituloId: number) => {
    try {
      console.log('🔍 Carregando registros para título:', tituloId);
      setLoadingRegistros(true);
      const data = await registroBpmnService.getAllByTitulo(tituloId);
      setRegistros(data);
      console.log('✅ Registros carregados:', data.length);
    } catch (error) {
      console.error('❌ Erro ao carregar registros:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registros BPMN.',
        variant: 'destructive',
      });
    } finally {
      setLoadingRegistros(false);
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

  const registroAtual = registros.find(r => r.id?.toString() === registroSelecionado);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Visualizar BPMN
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visualize e baixe diagramas BPMN em formato PNG
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Seleção de BPMN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título BPMN</label>
              <Select value={tituloSelecionado} onValueChange={setTituloSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um título" />
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

            {tituloSelecionado && (
              <div>
                <label className="text-sm font-medium mb-2 block">Versão</label>
                <Select value={registroSelecionado} onValueChange={setRegistroSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingRegistros ? "Carregando..." : "Selecione uma versão"} />
                  </SelectTrigger>
                  <SelectContent>
                    {registros.map((registro) => (
                      <SelectItem key={registro.id} value={registro.id!.toString()}>
                        Versão {registro.versao} - {formatDate(registro.data_registro)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {registroAtual && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Detalhes do BPMN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{registroAtual.titulo}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">Versão {registroAtual.versao}</Badge>
                  {registroAtual.registrado_por && (
                    <Badge variant="outline">Por: {registroAtual.registrado_por}</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Registrado em: {formatDate(registroAtual.data_registro)}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Arquivo Disponível</h4>
                <div className="space-y-2">
                  {registroAtual.arquivo_png ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleDownload(registroAtual.arquivo_png!, `${registroAtual.titulo}_v${registroAtual.versao}.png`)}
                    >
                      <Image className="h-4 w-4" />
                      <span className="ml-2">Baixar PNG</span>
                      <Download className="ml-auto h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                      Nenhum arquivo PNG disponível para esta versão.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
