import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { tonerService } from '@/services';
import type { Toner } from '@/types';

interface FormData {
  modelo: string;
  peso_cheio: string;
  peso_vazio: string;
  gramatura: string;
  preco_produto: string;
  capacidade_folhas: string;
  valor_por_folha: string;
  impressoras_compat: string;
  cor: string;
  registrado_por: string;
}

export const TonerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    modelo: '',
    peso_cheio: '',
    peso_vazio: '',
    gramatura: '',
    preco_produto: '',
    capacidade_folhas: '',
    valor_por_folha: '',
    impressoras_compat: '',
    cor: '',
    registrado_por: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tonerData = {
        modelo: formData.modelo,
        peso_cheio: parseFloat(formData.peso_cheio),
        peso_vazio: parseFloat(formData.peso_vazio),
        gramatura: parseFloat(formData.gramatura),
        preco_produto: parseFloat(formData.preco_produto),
        capacidade_folhas: parseInt(formData.capacidade_folhas),
        valor_por_folha: parseFloat(formData.valor_por_folha),
        impressoras_compat: formData.impressoras_compat,
        cor: formData.cor,
        registrado_por: parseInt(formData.registrado_por),
      };

      await tonerService.create(tonerData);
      setSuccess('Toner cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        modelo: '',
        peso_cheio: '',
        peso_vazio: '',
        gramatura: '',
        preco_produto: '',
        capacidade_folhas: '',
        valor_por_folha: '',
        impressoras_compat: '',
        cor: '',
        registrado_por: '',
      });
      
    } catch (error) {
      console.error('Erro ao cadastrar toner:', error);
      setError('Erro ao cadastrar toner. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Toner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="peso_cheio">Peso Cheio</Label>
              <Input
                type="number"
                id="peso_cheio"
                name="peso_cheio"
                value={formData.peso_cheio}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="peso_vazio">Peso Vazio</Label>
              <Input
                type="number"
                id="peso_vazio"
                name="peso_vazio"
                value={formData.peso_vazio}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="gramatura">Gramatura</Label>
              <Input
                type="number"
                id="gramatura"
                name="gramatura"
                value={formData.gramatura}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="preco_produto">Preço Produto</Label>
              <Input
                type="number"
                id="preco_produto"
                name="preco_produto"
                value={formData.preco_produto}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="capacidade_folhas">Capacidade de Folhas</Label>
              <Input
                type="number"
                id="capacidade_folhas"
                name="capacidade_folhas"
                value={formData.capacidade_folhas}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="valor_por_folha">Valor por Folha</Label>
              <Input
                type="number"
                id="valor_por_folha"
                name="valor_por_folha"
                value={formData.valor_por_folha}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="impressoras_compat">Impressoras Compatíveis</Label>
              <Textarea
                id="impressoras_compat"
                name="impressoras_compat"
                value={formData.impressoras_compat}
                onChange={handleChange}
                placeholder="Lista de impressoras compatíveis separadas por vírgula"
              />
            </div>
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                type="text"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="registrado_por">Registrado Por</Label>
              <Input
                type="number"
                id="registrado_por"
                name="registrado_por"
                value={formData.registrado_por}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cadastrar
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </CardContent>
    </Card>
  );
};
