
import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const unidades = [
  'Todas',
  'Matriz - São Paulo',
  'Filial Rio de Janeiro',
  'Filial Belo Horizonte',
  'Filial Brasília',
  'Filial Salvador',
  'Filial Recife',
  'Filial Fortaleza',
  'Filial Porto Alegre',
  'Filial Curitiba',
  'Filial Goiânia'
];

interface AuditoriaFiltersProps {
  dataInicio: string;
  dataFim: string;
  unidadeSelecionada: string;
  onDataInicioChange: (value: string) => void;
  onDataFimChange: (value: string) => void;
  onUnidadeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const AuditoriaFilters: React.FC<AuditoriaFiltersProps> = ({
  dataInicio,
  dataFim,
  unidadeSelecionada,
  onDataInicioChange,
  onDataFimChange,
  onUnidadeChange,
  onClearFilters,
}) => {
  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtros de Pesquisa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data Início (a partir de)</Label>
            <Input
              id="data_inicio"
              type="date"
              value={dataInicio}
              onChange={(e) => onDataInicioChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="data_fim">Data Fim (até)</Label>
            <Input
              id="data_fim"
              type="date"
              value={dataFim}
              onChange={(e) => onDataFimChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Unidade</Label>
            <Select value={unidadeSelecionada} onValueChange={onUnidadeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unidades.map((unidade) => (
                  <SelectItem key={unidade} value={unidade}>
                    {unidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={onClearFilters} className="w-full">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
