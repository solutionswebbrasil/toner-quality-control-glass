
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { tonerService } from '@/services/tonerService';
import { Toner } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface TonerFormProps {
  onSuccess?: () => void;
}

export const TonerForm: React.FC<TonerFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    modelo: '',
    peso_cheio: 0,
    peso_vazio: 0,
    gramatura: 0,
    preco_produto: 0,
    capacidade_folhas: 0,
    valor_por_folha: 0,
    impressoras_compat: '',
    cor: '',
    registrado_por: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Usuário não autenticado' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const tonerData: Omit<Toner, 'id' | 'data_registro'> = {
        ...formData,
        user_id: user.id
      };

      await tonerService.create(tonerData);
      
      setMessage({ type: 'success', text: 'Toner cadastrado com sucesso!' });
      setFormData({
        modelo: '',
        peso_cheio: 0,
        peso_vazio: 0,
        gramatura: 0,
        preco_produto: 0,
        capacidade_folhas: 0,
        valor_por_folha: 0,
        impressoras_compat: '',
        cor: '',
        registrado_por: 0
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao salvar toner:', error);
      setMessage({ type: 'error', text: 'Erro ao cadastrar toner' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Toner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                placeholder="Modelo do toner"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={formData.cor}
                onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                placeholder="Cor do toner"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso_cheio">Peso Cheio (g)</Label>
              <Input
                id="peso_cheio"
                type="number"
                step="0.01"
                value={formData.peso_cheio}
                onChange={(e) => setFormData(prev => ({ ...prev, peso_cheio: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso_vazio">Peso Vazio (g)</Label>
              <Input
                id="peso_vazio"
                type="number"
                step="0.01"
                value={formData.peso_vazio}
                onChange={(e) => setFormData(prev => ({ ...prev, peso_vazio: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gramatura">Gramatura (g)</Label>
              <Input
                id="gramatura"
                type="number"
                step="0.01"
                value={formData.gramatura}
                onChange={(e) => setFormData(prev => ({ ...prev, gramatura: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_produto">Preço do Produto (R$)</Label>
              <Input
                id="preco_produto"
                type="number"
                step="0.01"
                value={formData.preco_produto}
                onChange={(e) => setFormData(prev => ({ ...prev, preco_produto: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade_folhas">Capacidade de Folhas</Label>
              <Input
                id="capacidade_folhas"
                type="number"
                value={formData.capacidade_folhas}
                onChange={(e) => setFormData(prev => ({ ...prev, capacidade_folhas: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_por_folha">Valor por Folha (R$)</Label>
              <Input
                id="valor_por_folha"
                type="number"
                step="0.0001"
                value={formData.valor_por_folha}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_por_folha: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="impressoras_compat">Impressoras Compatíveis</Label>
              <Input
                id="impressoras_compat"
                value={formData.impressoras_compat}
                onChange={(e) => setFormData(prev => ({ ...prev, impressoras_compat: e.target.value }))}
                placeholder="Lista de impressoras compatíveis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrado_por">Registrado Por (ID)</Label>
              <Input
                id="registrado_por"
                type="number"
                value={formData.registrado_por}
                onChange={(e) => setFormData(prev => ({ ...prev, registrado_por: parseInt(e.target.value) }))}
                required
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
            Cadastrar Toner
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
