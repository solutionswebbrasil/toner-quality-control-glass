
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { retornadoService } from '@/services/retornadoService';
import { tonerService } from '@/services/tonerService';
import { Retornado, Toner } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toners, setToners] = useState<Toner[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    id_modelo: 0,
    id_cliente: 0,
    peso: 0,
    destino_final: 'Estoque',
    filial: '',
    valor_recuperado: ''
  });

  useEffect(() => {
    loadToners();
  }, []);

  const loadToners = async () => {
    try {
      const tonersData = await tonerService.getAll();
      setToners(tonersData);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
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
      const retornadoData: Omit<Retornado, 'id' | 'modelo'> = {
        id_modelo: formData.id_modelo,
        id_cliente: formData.id_cliente,
        peso: formData.peso,
        destino_final: formData.destino_final,
        filial: formData.filial,
        valor_recuperado: parseFloat(formData.valor_recuperado) || 0,
        user_id: user.id,
        data_registro: new Date().toISOString()
      };

      await retornadoService.create(retornadoData);
      
      setMessage({ type: 'success', text: 'Retornado registrado com sucesso!' });
      setFormData({
        id_modelo: 0,
        id_cliente: 0,
        peso: 0,
        destino_final: 'Estoque',
        filial: '',
        valor_recuperado: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar retornado:', error);
      setMessage({ type: 'error', text: 'Erro ao registrar retornado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Retornado</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_modelo">Modelo do Toner</Label>
              <Select 
                value={formData.id_modelo.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_modelo: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {toners.map((toner) => (
                    <SelectItem key={toner.id} value={toner.id!.toString()}>
                      {toner.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_cliente">ID Cliente</Label>
              <Input
                id="id_cliente"
                type="number"
                value={formData.id_cliente}
                onChange={(e) => setFormData(prev => ({ ...prev, id_cliente: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso (g)</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                value={formData.peso}
                onChange={(e) => setFormData(prev => ({ ...prev, peso: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino_final">Destino Final</Label>
              <Select 
                value={formData.destino_final} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, destino_final: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Descarte">Descarte</SelectItem>
                  <SelectItem value="Garantia">Garantia</SelectItem>
                  <SelectItem value="Estoque">Estoque</SelectItem>
                  <SelectItem value="Uso Interno">Uso Interno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filial">Filial</Label>
              <Input
                id="filial"
                value={formData.filial}
                onChange={(e) => setFormData(prev => ({ ...prev, filial: e.target.value }))}
                placeholder="Nome da filial"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_recuperado">Valor Recuperado (R$)</Label>
              <Input
                id="valor_recuperado"
                type="number"
                step="0.01"
                value={formData.valor_recuperado}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_recuperado: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              {message.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar Retornado
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
