
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { tituloItPopService, TituloItPop } from '@/services/tituloItPopService';
import { registroItPopService, RegistroItPop } from '@/services/registroItPopService';
import { FileText } from 'lucide-react';

interface VisualizadorItPopProps {
  onSuccess: () => void;
}

export const VisualizadorItPop: React.FC<VisualizadorItPopProps> = ({ onSuccess }) => {
  const [titulos, setTitulos] = useState<TituloItPop[]>([]);
  const [tituloSelecionado, setTituloSelecionado] = useState('');
  const [ultimaVersao, setUltimaVersao] = useState<RegistroItPop | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTitulos();
  }, []);

  const loadTitulos = async () => {
    try {
      const data = await tituloItPopService.getAll();
      setTitulos(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar títulos.",
        variant: "destructive"
      });
    }
  };

  const handleTituloChange = async (value: string) => {
    setTituloSelecionado(value);
    setLoading(true);
    
    try {
      const tituloId = parseInt(value);
      const versao = await registroItPopService.getLatestVersion(tituloId);
      setUltimaVersao(versao);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar documento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizarPDF = () => {
    if (ultimaVersao) {
      toast({
        title: "Visualizando PDF",
        description: `Abrindo: ${ultimaVersao.arquivo_pdf}`,
      });
      // Aqui seria implementada a lógica para abrir o PDF
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Visualizar POP/IT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="titulo">Selecione um Título</Label>
            <Select value={tituloSelecionado} onValueChange={handleTituloChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um título para visualizar" />
              </SelectTrigger>
              <SelectContent>
                {titulos.map((titulo) => (
                  <SelectItem key={titulo.id} value={titulo.id.toString()}>
                    {titulo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="text-center py-4">
              Carregando documento...
            </div>
          )}

          {ultimaVersao && !loading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Última Versão Disponível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="font-semibold">Título:</Label>
                    <p>{ultimaVersao.titulo}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Versão:</Label>
                    <p>v{ultimaVersao.versao}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Setor:</Label>
                    <p>{ultimaVersao.setor_responsavel}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Data Upload:</Label>
                    <p>{new Date(ultimaVersao.data_upload).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Arquivo:</Label>
                    <p>{ultimaVersao.arquivo_pdf}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Permissão:</Label>
                    <p>{ultimaVersao.permissao_visualizacao === 'qualquer_pessoa' ? 'Qualquer pessoa' : 'Apenas setor'}</p>
                  </div>
                </div>
                
                <Button onClick={handleVisualizarPDF} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Visualizar PDF
                </Button>
              </CardContent>
            </Card>
          )}

          {tituloSelecionado && !ultimaVersao && !loading && (
            <div className="text-center py-8 text-gray-500">
              Nenhum documento encontrado para este título.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
