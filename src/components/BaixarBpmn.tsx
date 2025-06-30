
import React, { useState } from 'react';
import { Download, Layers, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface BaixarBpmnProps {
  onSuccess: () => void;
}

// Mock data
const titulosDisponiveis = [
  { id: 1, titulo: 'Processo de Aprovação' },
  { id: 2, titulo: 'Fluxo de Vendas' },
  { id: 3, titulo: 'Gestão de Projetos' },
];

const registrosBpmn = [
  {
    id: 1,
    titulo_id: 1,
    titulo: 'Processo de Aprovação',
    versao: 3,
    arquivo_pdf: 'aprovacao_v3.pdf',
    arquivo_jpg: 'aprovacao_v3.jpg',
    arquivo_bizagi: 'aprovacao_v3.bizagi',
    data_registro: new Date('2024-02-15'),
  },
  {
    id: 2,
    titulo_id: 1,
    titulo: 'Processo de Aprovação',
    versao: 2,
    arquivo_pdf: 'aprovacao_v2.pdf',
    arquivo_png: 'aprovacao_v2.png',
    data_registro: new Date('2024-01-10'),
  },
  {
    id: 3,
    titulo_id: 1,
    titulo: 'Processo de Aprovação',
    versao: 1,
    arquivo_pdf: 'aprovacao_v1.pdf',
    data_registro: new Date('2023-12-05'),
  },
];

export const BaixarBpmn: React.FC<BaixarBpmnProps> = ({ onSuccess }) => {
  const [tituloSelecionado, setTituloSelecionado] = useState<string>('');

  const registrosFiltrados = registrosBpmn.filter(
    registro => tituloSelecionado ? registro.titulo_id.toString() === tituloSelecionado : false
  ).sort((a, b) => b.versao - a.versao); // Ordenar por versão decrescente

  const handleDownload = (arquivo: string, tipo: string, versao: number) => {
    console.log(`Baixando arquivo ${tipo} versão ${versao}:`, arquivo);
    // Aqui implementaria o download real
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'JPG':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'PNG':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'Bizagi':
        return <Layers className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Baixar Arquivos BPMN
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visualize e baixe todas as versões de um BPMN
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Seleção de Título
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título BPMN</label>
            <Select onValueChange={setTituloSelecionado} value={tituloSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o título" />
              </SelectTrigger>
              <SelectContent>
                {titulosDisponiveis.map((titulo) => (
                  <SelectItem key={titulo.id} value={titulo.id.toString()}>
                    {titulo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {registrosFiltrados.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Versões Disponíveis</h3>
              {registrosFiltrados.map((registro) => (
                <div key={registro.id} className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Versão {registro.versao}</Badge>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Registrado em {registro.data_registro.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {registro.arquivo_pdf && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border">
                        <div className="flex items-center gap-2">
                          {getFileIcon('PDF')}
                          <span className="text-sm font-medium">PDF</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {registro.arquivo_pdf}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(registro.arquivo_pdf!, 'PDF', registro.versao)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    )}

                    {registro.arquivo_jpg && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border">
                        <div className="flex items-center gap-2">
                          {getFileIcon('JPG')}
                          <span className="text-sm font-medium">JPG</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {registro.arquivo_jpg}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(registro.arquivo_jpg!, 'JPG', registro.versao)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    )}

                    {registro.arquivo_png && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border">
                        <div className="flex items-center gap-2">
                          {getFileIcon('PNG')}
                          <span className="text-sm font-medium">PNG</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {registro.arquivo_png}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(registro.arquivo_png!, 'PNG', registro.versao)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    )}

                    {registro.arquivo_bizagi && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border">
                        <div className="flex items-center gap-2">
                          {getFileIcon('Bizagi')}
                          <span className="text-sm font-medium">Bizagi</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {registro.arquivo_bizagi}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(registro.arquivo_bizagi!, 'Bizagi', registro.versao)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tituloSelecionado && registrosFiltrados.length === 0 && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Nenhum registro encontrado para este título.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
