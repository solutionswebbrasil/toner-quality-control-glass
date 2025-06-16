
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Wrench } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { garantiaTonerService, GarantiaToner } from '@/services/garantiaTonerService';
import { toast } from '@/hooks/use-toast';

interface GarantiaTonerFormProps {
  onSuccess?: () => void;
  tonerData?: {
    modelo: string;
    filial: string;
  };
}

export const GarantiaTonerForm: React.FC<GarantiaTonerFormProps> = ({ onSuccess, tonerData }) => {
  const [formData, setFormData] = useState({
    modelo_toner: tonerData?.modelo || '',
    filial_origem: tonerData?.filial || '',
    fornecedor: '',
    defeito: '',
    responsavel_envio: '',
    data_envio: new Date(),
    ns: '',
    lote: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.modelo_toner || !formData.filial_origem || !formData.fornecedor || 
        !formData.defeito || !formData.responsavel_envio) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await garantiaTonerService.create({
        ...formData,
        data_envio: formData.data_envio.toISOString()
      });

      toast({
        title: "Sucesso!",
        description: "Garantia de toner registrada com sucesso.",
      });

      // Reset form
      setFormData({
        modelo_toner: '',
        filial_origem: '',
        fornecedor: '',
        defeito: '',
        responsavel_envio: '',
        data_envio: new Date(),
        ns: '',
        lote: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao registrar garantia de toner:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar garantia de toner.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Registrar Garantia de Toner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modelo_toner">Modelo do Toner *</Label>
              <Input
                id="modelo_toner"
                value={formData.modelo_toner}
                onChange={(e) => setFormData({ ...formData, modelo_toner: e.target.value })}
                placeholder="Digite o modelo do toner"
                required
              />
            </div>

            <div>
              <Label htmlFor="filial_origem">Filial de Origem *</Label>
              <Input
                id="filial_origem"
                value={formData.filial_origem}
                onChange={(e) => setFormData({ ...formData, filial_origem: e.target.value })}
                placeholder="Digite a filial de origem"
                required
              />
            </div>

            <div>
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                placeholder="Digite o fornecedor"
                required
              />
            </div>

            <div>
              <Label htmlFor="responsavel_envio">Responsável pelo Envio *</Label>
              <Input
                id="responsavel_envio"
                value={formData.responsavel_envio}
                onChange={(e) => setFormData({ ...formData, responsavel_envio: e.target.value })}
                placeholder="Digite o responsável"
                required
              />
            </div>

            <div>
              <Label htmlFor="ns">Número de Série (NS)</Label>
              <Input
                id="ns"
                value={formData.ns}
                onChange={(e) => setFormData({ ...formData, ns: e.target.value })}
                placeholder="Digite o número de série"
              />
            </div>

            <div>
              <Label htmlFor="lote">Lote</Label>
              <Input
                id="lote"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                placeholder="Digite o lote"
              />
            </div>
          </div>

          <div>
            <Label>Data de Envio *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.data_envio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data_envio ? (
                    format(formData.data_envio, "PPP", { locale: ptBR })
                  ) : (
                    "Selecione a data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data_envio}
                  onSelect={(date) => date && setFormData({ ...formData, data_envio: date })}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="defeito">Descrição do Defeito *</Label>
            <Textarea
              id="defeito"
              value={formData.defeito}
              onChange={(e) => setFormData({ ...formData, defeito: e.target.value })}
              placeholder="Descreva o defeito encontrado"
              rows={3}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Registrar Garantia"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
