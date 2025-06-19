import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { auditoriaService } from '@/services/auditoriaService';
import { Auditoria } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface AuditoriaFormProps {
  onSuccess?: () => void;
}

export const AuditoriaForm: React.FC<AuditoriaFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    data_inicio: '',
    data_fim: '',
    unidade_auditada: '',
    formulario_pdf: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, formulario_pdf: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Usuário não autenticado' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const auditoriaData: Omit<Auditoria, 'id' | 'data_registro'> = {
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        unidade_auditada: formData.unidade_auditada,
        formulario_pdf: formData.formulario_pdf ? formData.formulario_pdf.name : null,
        user_id: user.id
      };

      await auditoriaService.create(auditoriaData);
      
      setMessage({ type: 'success', text: 'Auditoria registrada com sucesso!' });
      setFormData({
        data_inicio: '',
        data_fim: '',
        unidade_auditada: '',
        formulario_pdf: null
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar auditoria:', error);
      setMessage({ type: 'error', text: 'Erro ao registrar auditoria' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Auditoria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, data_fim: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidade_auditada">Unidade Auditada</Label>
            <Input
              id="unidade_auditada"
              value={formData.unidade_auditada}
              onChange={(e) => setFormData(prev => ({ ...prev, unidade_auditada: e.target.value }))}
              placeholder="Digite a unidade auditada"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formulario_pdf">Formulário PDF</Label>
            <Input
              id="formulario_pdf"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              {message.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar Auditoria
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
