import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChartFilters, DateFilter } from './ChartFilters';
import { RetornadosCharts } from './charts/RetornadosCharts';
import { GarantiasCharts } from './charts/GarantiasCharts';
import { NaoConformidadesCharts } from './charts/NaoConformidadesCharts';

export const KpisPage: React.FC = () => {
  const [filter, setFilter] = useState<DateFilter>({
    type: 'year',
    year: new Date().getFullYear()
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
          KPIs - Indicadores de Performance
        </h1>
        <ChartFilters filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Retornados Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Retornados
        </h2>
        <RetornadosCharts filter={filter} />
      </div>

      <Separator className="my-8" />

      {/* Garantias Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Garantias
        </h2>
        <GarantiasCharts filter={filter} />
      </div>

      <Separator className="my-8" />

      {/* Não Conformidades Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
          Não Conformidades
        </h2>
        <NaoConformidadesCharts filter={filter} />
      </div>
    </div>
  );
};