import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { auditoriaService } from '@/services/auditoriaService';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

interface AuditoriaFormData {
  data_inicio: string;
  data_fim: string;
  unidade_auditada: string;
  formulario_pdf: File | null;
}

export const AuditoriaForm: React.FC = () => {
  const [formData, setFormData] = useState<AuditoriaFormData>({
    data_inicio: '',
    data_fim: '',
    unidade_auditada: '',
    formulario_pdf: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, formulario_pdf: e.target.files[0] });
    } else {
      setFormData({ ...formData, formulario_pdf: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const auditoriaData = {
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        unidade_auditada: formData.unidade_auditada,
        formulario_pdf: formData.formulario_pdf,
      };

      await auditoriaService.create(auditoriaData);
      setSuccess('Auditoria cadastrada com sucesso!');
      
      // Reset form
      setFormData({
        data_inicio: '',
        data_fim: '',
        unidade_auditada: '',
        formulario_pdf: null,
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao cadastrar auditoria:', error);
      setError('Erro ao cadastrar auditoria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                type="date"
                id="data_inicio"
                name="data_inicio"
                value={formData.data_inicio}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                type="date"
                id="data_fim"
                name="data_fim"
                value={formData.data_fim}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="unidade_auditada">Unidade Auditada</Label>
              <Input
                type="text"
                id="unidade_auditada"
                name="unidade_auditada"
                value={formData.unidade_auditada}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="formulario_pdf">Formulário (PDF)</Label>
              <Input
                type="file"
                id="formulario_pdf"
                name="formulario_pdf"
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full"
                ref={fileInputRef}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
