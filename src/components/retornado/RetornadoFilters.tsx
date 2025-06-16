
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const filiais = [
  'Todas',
  'Matriz',
  'Filial 1',
  'Filial 2',
  'Filial 3',
  'Filial 4',
  'Filial 5'
];

const destinosFinais = [
  'Todos',
  'Descarte',
  'Garantia',
  'Estoque',
  'Uso Interno'
];

interface RetornadoFiltersProps {
  dataInicio: string;
  setDataInicio: (value: string) => void;
  dataFim: string;
  setDataFim: (value: string) => void;
  filialSelecionada: string;
  setFilialSelecionada: (value: string) => void;
  destinoSelecionado: string;
  setDestinoSelecionado: (value: string) => void;
  clearFilters: () => void;
  resultCount: number;
}

export const RetornadoFilters: React.FC<RetornadoFiltersProps> = ({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  filialSelecionada,
  setFilialSelecionada,
  destinoSelecionado,
  setDestinoSelecionado,
  clearFilters,
  resultCount
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data Início</Label>
            <Input
              id="data_inicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="data_fim">Data Fim</Label>
            <Input
              id="data_fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Filial</Label>
            <Select value={filialSelecionada} onValueChange={setFilialSelecionada}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filiais.map((filial) => (
                  <SelectItem key={filial} value={filial}>
                    {filial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Destino Final</Label>
            <Select value={destinoSelecionado} onValueChange={setDestinoSelecionado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {destinosFinais.map((destino) => (
                  <SelectItem key={destino} value={destino}>
                    {destino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-y-2">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Limpar Filtros
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {resultCount} registro(s) encontrado(s)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
