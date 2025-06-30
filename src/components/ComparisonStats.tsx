
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonStatsProps {
  currentValue: number;
  previousValue: number;
  label: string;
  format?: 'number' | 'currency';
}

export const ComparisonStats: React.FC<ComparisonStatsProps> = ({
  currentValue,
  previousValue,
  label,
  format = 'number'
}) => {
  const percentageChange = previousValue > 0 
    ? ((currentValue - previousValue) / previousValue) * 100 
    : currentValue > 0 ? 100 : 0;

  const isIncrease = percentageChange > 0;
  const isDecrease = percentageChange < 0;

  const formatValue = (value: number) => {
    if (format === 'currency') {
      return value.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      });
    }
    return value.toLocaleString('pt-BR');
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold">{formatValue(currentValue)}</p>
          </div>
          <div className="flex items-center gap-2">
            {isIncrease && (
              <>
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{percentageChange.toFixed(1)}%
                </span>
              </>
            )}
            {isDecrease && (
              <>
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {percentageChange.toFixed(1)}%
                </span>
              </>
            )}
            {!isIncrease && !isDecrease && (
              <span className="text-sm font-medium text-slate-500">
                0%
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          vs período anterior: {formatValue(previousValue)}
        </p>
      </CardContent>
    </Card>
  );
};
