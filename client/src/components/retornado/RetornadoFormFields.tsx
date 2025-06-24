
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toner } from '@/types';
import type { Filial } from '@/types/filial';

export interface RetornadoFormFieldsProps {
  peso: string;
  destino_final: string;
  filial: string;
  filiais: Filial[];
  selectedToner: Toner | null;
  destinoSelecionado: boolean;
  onPesoChange: (peso: string) => void;
  onDestinoChange: (destino: string) => void;
  onFilialChange: (filial: string) => void;
  onDestinoSelecionado: (selected: boolean) => void;
}

export const RetornadoFormFields: React.FC<RetornadoFormFieldsProps> = ({
  peso,
  destino_final,
  filial,
  filiais,
  selectedToner,
  destinoSelecionado,
  onPesoChange,
  onDestinoChange,
  onFilialChange,
  onDestinoSelecionado
}) => {
  const calculateDestino = () => {
    if (!selectedToner || !peso) return;
    
    const pesoAtual = parseFloat(peso);
    const pesoVazio = selectedToner.peso_vazio;
    const gramaturaRestante = Math.max(0, pesoAtual - pesoVazio);
    const percentualGramatura = (gramaturaRestante / selectedToner.gramatura) * 100;
    
    if (percentualGramatura >= 15) {
      onDestinoChange('Estoque');
    } else if (percentualGramatura >= 5) {
      onDestinoChange('Garantia');
    } else {
      onDestinoChange('Descarte');
    }
    
    onDestinoSelecionado(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="peso">Peso Atual (kg)</Label>
        <Input
          id="peso"
          type="number"
          step="0.01"
          value={peso}
          onChange={(e) => onPesoChange(e.target.value)}
          placeholder="Ex: 1.25"
        />
      </div>

      {peso && selectedToner && (
        <Button
          type="button"
          onClick={calculateDestino}
          className="w-full"
          variant="outline"
        >
          Calcular Destino Final
        </Button>
      )}

      {destinoSelecionado && (
        <div>
          <Label htmlFor="destino">Destino Final</Label>
          <Input
            id="destino"
            value={destino_final}
            readOnly
            className="bg-gray-100"
          />
        </div>
      )}

      <div>
        <Label htmlFor="filial">Filial</Label>
        <Select value={filial} onValueChange={onFilialChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a filial" />
          </SelectTrigger>
          <SelectContent>
            {filiais.map((filialItem) => (
              <SelectItem key={filialItem.id} value={filialItem.nome}>
                {filialItem.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
