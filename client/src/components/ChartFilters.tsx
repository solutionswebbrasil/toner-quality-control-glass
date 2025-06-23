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
    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Período:
          </label>
          <Select
            value={filter.type}
            onValueChange={(value: 'range' | 'month' | 'year') => 
              onFilterChange({ ...filter, type: value })
            }
          >
            <SelectTrigger className="w-36 h-8 text-xs bg-white dark:bg-slate-800">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="range">Personalizado</SelectItem>
              <SelectItem value="month">Por Mês</SelectItem>
              <SelectItem value="year">Por Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filter.type === 'range' && (
          <div className="flex items-center gap-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Data:
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-48 h-8 justify-start text-left font-normal text-xs bg-white dark:bg-slate-800",
                    !filter.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {filter.startDate ? (
                    filter.endDate ? (
                      <>
                        {format(filter.startDate, "dd/MM/yy")} até{" "}
                        {format(filter.endDate, "dd/MM/yy")}
                      </>
                    ) : (
                      format(filter.startDate, "dd/MM/yy")
                    )
                  ) : (
                    <span>Período</span>
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
          <div className="flex items-center gap-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Mês:
            </label>
            <Select
              value={filter.month?.toString()}
              onValueChange={(value) => 
                onFilterChange({ ...filter, month: parseInt(value) })
              }
            >
              <SelectTrigger className="w-24 h-8 text-xs bg-white dark:bg-slate-800">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {format(new Date(2024, i), 'MMM', { locale: ptBR })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(filter.type === 'month' || filter.type === 'year') && (
          <div className="flex items-center gap-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Ano:
            </label>
            <Select
              value={filter.year?.toString()}
              onValueChange={(value) => 
                onFilterChange({ ...filter, year: parseInt(value) })
              }
            >
              <SelectTrigger className="w-20 h-8 text-xs bg-white dark:bg-slate-800">
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

        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Filial:
          </label>
          <Select
            value={filter.filial || 'todas'}
            onValueChange={(value) => 
              onFilterChange({ ...filter, filial: value === 'todas' ? undefined : value })
            }
          >
            <SelectTrigger className="w-28 h-8 text-xs bg-white dark:bg-slate-800">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="Jundiaí">Jundiaí</SelectItem>
              <SelectItem value="Franca">Franca</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};