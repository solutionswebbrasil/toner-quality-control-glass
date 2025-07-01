
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { tituloItPopService, TituloItPop } from '@/services/tituloItPopService';
import { registroItPopService } from '@/services/registroItPopService';

interface RegistroItPopFormProps {
  onSuccess: () => void;
}

export const RegistroItPopForm: React.FC<RegistroItPopFormProps> = ({ onSuccess }) => {
  const [titulos, setTitulos] = useState<TituloItPop[]>([]);
  const [formData, setFormData] = useState({
    titulo_id: '',
    titulo: '',
    arquivo_pdf: '',
    setor_responsavel: '',
    permissao_visualizacao: 'qualquer_pessoa' as 'qualquer_pessoa' | 'apenas_setor',
    data_upload: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const setores = [
    'Administrativo',
    'Financeiro',
    'Recursos Humanos',
    'TI',
    'Produção',
    'Qualidade',
    'Manutenção',
    'Vendas',
    'Marketing',
    'Outros'
  ];

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

  const handleTituloChange = (value: string) => {
    const tituloSelecionado = titulos.find(t => t.id.toString() === value);
    setFormData(prev => ({
      ...prev,
      titulo_id: value,
      titulo: tituloSelecionado?.titulo || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo_id || !formData.arquivo_pdf || !formData.setor_responsavel) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await registroItPopService.create({
        titulo_id: parseInt(formData.titulo_id),
        titulo: formData.titulo,
        arquivo_pdf: formData.arquivo_pdf,
        setor_responsavel: formData.setor_responsavel,
        permissao_visualizacao: formData.permissao_visualizacao,
        data_upload: formData.data_upload
      });

      toast({
        title: "Sucesso",
        description: "Documento POP/IT registrado com sucesso!"
      });

      setFormData({
        titulo_id: '',
        titulo: '',
        arquivo_pdf: '',
        setor_responsavel: '',
        permissao_visualizacao: 'qualquer_pessoa',
        data_upload: new Date().toISOString().split('T')[0]
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar documento POP/IT.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Registro de POP/IT</CardTitle>
          <CardDescription>
            Registre documentos POP (Procedimento Operacional Padrão) e IT (Instrução de Trabalho)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="titulo">Título do Documento</Label>
              <Select value={formData.titulo_id} onValueChange={handleTituloChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um título" />
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

            <div>
              <Label htmlFor="arquivo_pdf">Arquivo PDF</Label>
              <Input
                id="arquivo_pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  arquivo_pdf: e.target.files?.[0]?.name || '' 
                }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="setor">Setor Responsável</Label>
              <Select value={formData.setor_responsavel} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, setor_responsavel: value }))
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem key={setor} value={setor}>
                      {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Permissão de Visualização</Label>
              <RadioGroup
                value={formData.permissao_visualizacao}
                onValueChange={(value: 'qualquer_pessoa' | 'apenas_setor') => 
                  setFormData(prev => ({ ...prev, permissao_visualizacao: value }))
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qualquer_pessoa" id="qualquer_pessoa" />
                  <Label htmlFor="qualquer_pessoa">Qualquer pessoa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apenas_setor" id="apenas_setor" />
                  <Label htmlFor="apenas_setor">Apenas pessoas do setor correspondente</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="data_upload">Data de Upload</Label>
              <Input
                id="data_upload"
                type="date"
                value={formData.data_upload}
                onChange={(e) => setFormData(prev => ({ ...prev, data_upload: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Registrar Documento'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
