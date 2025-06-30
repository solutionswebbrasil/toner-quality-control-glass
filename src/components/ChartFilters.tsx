
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateFilter {
  type: 'day' | 'month' | 'year';
  startDate?: Date;
  endDate?: Date;
  month?: number;
  year?: number;
}

interface ChartFiltersProps {
  filter: DateFilter;
  onFilterChange: (filter: DateFilter) => void;
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({ filter, onFilterChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium mb-2 block">Período:</label>
            <Select value={filter.type} onValueChange={(value: 'day' | 'month' | 'year') => 
              onFilterChange({ ...filter, type: value })
            }>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Dia</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filter.type === 'day' && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Data Inicial:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-40 justify-start text-left font-normal",
                        !filter.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filter.startDate ? format(filter.startDate, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filter.startDate}
                      onSelect={(date) => onFilterChange({ ...filter, startDate: date })}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data Final:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-40 justify-start text-left font-normal",
                        !filter.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filter.endDate ? format(filter.endDate, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filter.endDate}
                      onSelect={(date) => onFilterChange({ ...filter, endDate: date })}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {filter.type === 'month' && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Mês:</label>
                <Select value={filter.month?.toString()} onValueChange={(value) => 
                  onFilterChange({ ...filter, month: parseInt(value) })
                }>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecionar mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ano:</label>
                <Select value={filter.year?.toString()} onValueChange={(value) => 
                  onFilterChange({ ...filter, year: parseInt(value) })
                }>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Selecionar ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {filter.type === 'year' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Ano:</label>
              <Select value={filter.year?.toString()} onValueChange={(value) => 
                onFilterChange({ ...filter, year: parseInt(value) })
              }>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Selecionar ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => onFilterChange({ type: 'month', month: new Date().getMonth(), year: new Date().getFullYear() })}
          >
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
