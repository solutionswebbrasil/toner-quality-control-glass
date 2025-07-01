
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { documentoVencimentoService } from '@/services/documentoVencimentoService';

interface DocumentoVencimentoFormProps {
  onSuccess: () => void;
}

export const DocumentoVencimentoForm: React.FC<DocumentoVencimentoFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome_documento: '',
    arquivo_pdf: '',
    data_vencimento: '',
    receber_lembrete: false,
    dias_antes_lembrete: 30
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_documento || !formData.arquivo_pdf || !formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await documentoVencimentoService.create({
        nome_documento: formData.nome_documento,
        arquivo_pdf: formData.arquivo_pdf,
        data_vencimento: formData.data_vencimento,
        receber_lembrete: formData.receber_lembrete,
        dias_antes_lembrete: formData.receber_lembrete ? formData.dias_antes_lembrete : undefined
      });

      toast({
        title: "Sucesso",
        description: "Documento cadastrado com sucesso!"
      });

      setFormData({
        nome_documento: '',
        arquivo_pdf: '',
        data_vencimento: '',
        receber_lembrete: false,
        dias_antes_lembrete: 30
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar documento.",
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
          <CardTitle>Cadastro de Documento com Vencimento</CardTitle>
          <CardDescription>
            Registre documentos institucionais com prazo de validade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nome_documento">Nome do Documento</Label>
              <Input
                id="nome_documento"
                type="text"
                value={formData.nome_documento}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_documento: e.target.value }))}
                placeholder="Ex: Certificado ISO 9001"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="arquivo_pdf">Upload do PDF</Label>
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
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) => setFormData(prev => ({ ...prev, data_vencimento: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="receber_lembrete"
                  checked={formData.receber_lembrete}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, receber_lembrete: checked }))}
                />
                <Label htmlFor="receber_lembrete">Deseja receber e-mail de lembrete?</Label>
              </div>

              {formData.receber_lembrete && (
                <div>
                  <Label htmlFor="dias_antes_lembrete">Quantos dias antes?</Label>
                  <Input
                    id="dias_antes_lembrete"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.dias_antes_lembrete}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dias_antes_lembrete: parseInt(e.target.value) || 30 
                    }))}
                    className="mt-1 max-w-32"
                  />
                </div>
              )}
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar Documento'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
