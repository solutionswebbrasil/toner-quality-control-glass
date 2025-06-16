
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Filial } from '@/types/filial';

interface RetornadoFormFieldsProps {
  idCliente: string;
  peso: string;
  filial: string;
  valorRecuperado: string;
  filiais: Filial[];
  onFieldChange: (field: string, value: string) => void;
}

export const RetornadoFormFields: React.FC<RetornadoFormFieldsProps> = ({
  idCliente,
  peso,
  filial,
  valorRecuperado,
  filiais,
  onFieldChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="id_cliente">ID do Cliente *</Label>
        <Input
          id="id_cliente"
          type="number"
          placeholder="123456"
          value={idCliente}
          onChange={(e) => onFieldChange('id_cliente', e.target.value)}
          required
          className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="peso">Peso Atual (g) *</Label>
        <Input
          id="peso"
          type="number"
          step="0.01"
          placeholder="125.5"
          value={peso}
          onChange={(e) => onFieldChange('peso', e.target.value)}
          required
          className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filial">Filial *</Label>
        <Select value={filial} onValueChange={(value) => onFieldChange('filial', value)}>
          <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
            <SelectValue placeholder="Selecione a filial" />
          </SelectTrigger>
          <SelectContent>
            {filiais.map((filial) => (
              <SelectItem key={filial.id} value={filial.nome}>
                {filial.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_recuperado">Valor Recuperado (R$)</Label>
        <Input
          id="valor_recuperado"
          type="number"
          step="0.01"
          placeholder="25.50"
          value={valorRecuperado}
          onChange={(e) => onFieldChange('valor_recuperado', e.target.value)}
          className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
        />
      </div>
    </>
  );
};
