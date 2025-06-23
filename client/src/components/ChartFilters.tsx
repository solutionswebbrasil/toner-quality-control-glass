import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface DateFilter {
  type: 'range' | 'month' | 'year';
  startDate?: Date;
  endDate?: Date;
  month?: number;
  year?: number;
  filial?: string;
}

interface ChartFiltersProps {
  filter: DateFilter;
  onFilterChange: (filter: DateFilter) => void;
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({ filter, onFilterChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Período:
          </label>
          <Select
            value={filter.type}
            onValueChange={(value: 'range' | 'month' | 'year') => 
              onFilterChange({ ...filter, type: value })
            }
          >
            <SelectTrigger className="w-44 bg-white dark:bg-slate-800">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="range">Período Personalizado</SelectItem>
              <SelectItem value="month">Por Mês</SelectItem>
              <SelectItem value="year">Por Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filter.type === 'range' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Data:
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-64 justify-start text-left font-normal bg-white dark:bg-slate-800",
                    !filter.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filter.startDate ? (
                    filter.endDate ? (
                      <>
                        {format(filter.startDate, "dd/MM/yyyy")} até{" "}
                        {format(filter.endDate, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(filter.startDate, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filter.startDate}
                  selected={{
                    from: filter.startDate,
                    to: filter.endDate,
                  }}
                  onSelect={(range) => {
                    onFilterChange({
                      ...filter,
                      startDate: range?.from,
                      endDate: range?.to,
                    });
                    setOpen(false);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {filter.type === 'month' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Mês:
            </label>
            <Select
              value={filter.month?.toString()}
              onValueChange={(value) => 
                onFilterChange({ ...filter, month: parseInt(value) })
              }
            >
              <SelectTrigger className="w-32 bg-white dark:bg-slate-800">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {format(new Date(2024, i), 'MMMM', { locale: ptBR })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(filter.type === 'month' || filter.type === 'year') && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ano:
            </label>
            <Select
              value={filter.year?.toString()}
              onValueChange={(value) => 
                onFilterChange({ ...filter, year: parseInt(value) })
              }
            >
              <SelectTrigger className="w-24 bg-white dark:bg-slate-800">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Filial:
          </label>
          <Select
            value={filter.filial || ''}
            onValueChange={(value) => 
              onFilterChange({ ...filter, filial: value || undefined })
            }
          >
            <SelectTrigger className="w-36 bg-white dark:bg-slate-800">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as Filiais</SelectItem>
              <SelectItem value="Jundiaí">Jundiaí</SelectItem>
              <SelectItem value="Franca">Franca</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};