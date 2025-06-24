
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Toner } from '@/types';

export interface TonerSelectorProps {
  toners: Toner[];
  value: string;
  onValueChange: (value: string) => void;
}

export const TonerSelector: React.FC<TonerSelectorProps> = ({
  toners,
  value,
  onValueChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="toner-select">Modelo do Toner</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o modelo do toner" />
        </SelectTrigger>
        <SelectContent>
          {toners.map((toner) => (
            <SelectItem key={toner.id} value={toner.id?.toString() || ''}>
              {toner.modelo} - {toner.cor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
