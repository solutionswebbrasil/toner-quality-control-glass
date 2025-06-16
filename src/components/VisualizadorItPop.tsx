
import React, { useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface VisualizadorItPopProps {
  onSuccess: () => void;
}

// Mock data
const titulosDisponiveis = [
  { id: 1, titulo: 'Procedimento de Backup' },
  { id: 2, titulo: 'Instalação de Software' },
  { id: 3, titulo: 'Configuração de Rede' },
];

const registrosItPop = [
  {
    id: 1,
    titulo_id: 1,
    titulo: 'Procedimento de Backup',
    versao: 3,
    arquivo_pdf: 'backup_v3.pdf',
    arquivo_ppt: 'backup_v3.pptx',
    data_registro: new Date('2024-02-15'),
  },
  {
    id: 2,
    titulo_id: 1,
    titulo: 'Procedimento de Backup',
    versao: 2,
    arquivo_pdf: 'backup_v2.pdf',
    data_registro: new Date('2024-01-10'),
  },
];

export const VisualizadorItPop: React.FC<VisualizadorItPopProps> = ({ onSuccess }) => {
  const [tituloSelecionado, setTituloSelecionado] = useState<string>('');

  const registrosFiltrados = registrosItPop.filter(
    registro => tituloSelecionado ? registro.titulo_id.toString() === tituloSelecionado : false
  );

  const ultimaVersao = registrosFiltrados.length > 0 
    ? registrosFiltrados.reduce((prev, current) => 
        prev.versao > current.versao ? prev : current
      )
    : null;

  const handleDownload = (arquivo: string, tipo: string) => {
    console.log(`Baixando arquivo ${tipo}:`, arquivo);
    // Aqui implementaria o download real
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Visualizar IT/POP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visualize a versão mais atual de um IT/POP
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Seleção de Título
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título IT/POP</label>
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

          {ultimaVersao && (
            <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{ultimaVersao.titulo}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default">Versão {ultimaVersao.versao}</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Registrado em {ultimaVersao.data_registro.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {ultimaVersao.arquivo_pdf && (
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Arquivo PDF</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {ultimaVersao.arquivo_pdf}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(ultimaVersao.arquivo_pdf!, 'PDF')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                )}

                {ultimaVersao.arquivo_ppt && (
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Arquivo PPT</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {ultimaVersao.arquivo_ppt}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(ultimaVersao.arquivo_ppt!, 'PPT')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {tituloSelecionado && !ultimaVersao && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Nenhum registro encontrado para este título.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
