
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { tituloItPopService } from '@/services/tituloItPopService';

interface TituloItPopFormProps {
  onSuccess: () => void;
}

export const TituloItPopForm: React.FC<TituloItPopFormProps> = ({ onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o título do documento.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await tituloItPopService.create({ titulo: titulo.trim() });
      toast({
        title: "Sucesso",
        description: "Título de POP/IT cadastrado com sucesso!"
      });
      setTitulo('');
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar título de POP/IT.",
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
          <CardTitle>Cadastro de Títulos de POP/IT</CardTitle>
          <CardDescription>
            Cadastre títulos que serão usados como referência para documentos POP/IT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título do Documento</Label>
              <Input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: POP 001 - Higienização de Equipamento"
                className="mt-1"
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Título'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
