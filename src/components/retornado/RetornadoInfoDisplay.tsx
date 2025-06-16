import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, AlertTriangle, DollarSign } from 'lucide-react';
import { Toner } from '@/types';
import { useRegrasRetornado } from '@/hooks/useRegrasRetornado';

interface RetornadoInfoDisplayProps {
  selectedToner: Toner | null;
  peso: string;
  destinoFinal: string;
  onDestinoChange: (destino: string) => void;
}

const destinosFinais = [
  'Descarte',
  'Garantia',
  'Estoque',
  'Uso Interno'
];

export const RetornadoInfoDisplay: React.FC<RetornadoInfoDisplayProps> = ({
  selectedToner,
  peso,
  destinoFinal,
  onDestinoChange
}) => {
  const { obterDestinoSugerido } = useRegrasRetornado();

  const calculateGramaturaRestante = () => {
    if (!selectedToner || !peso) return 0;
    const pesoAtual = parseFloat(peso);
    return Math.max(0, pesoAtual - selectedToner.peso_vazio);
  };

  const calculatePercentualGramaturaRestante = () => {
    if (!selectedToner) return '0';
    const gramaturaRestante = calculateGramaturaRestante();
    return ((gramaturaRestante / selectedToner.gramatura) * 100).toFixed(1);
  };

  const calculateValorRecuperado = () => {
    if (!selectedToner || !peso || destinoFinal !== 'Estoque') {
      return null;
    }
    
    const gramaturaRestante = calculateGramaturaRestante();
    const percentualGramatura = (gramaturaRestante / selectedToner.gramatura) * 100;
    const folhasRestantes = (percentualGramatura / 100) * selectedToner.capacidade_folhas;
    const valorRecuperado = folhasRestantes * selectedToner.valor_por_folha;
    
    return valorRecuperado.toFixed(2);
  };

  const getDestinoSugeridoInfo = () => {
    if (!selectedToner || !peso) return null;
    const percentualGramaturaRestante = parseFloat(calculatePercentualGramaturaRestante());
    return obterDestinoSugerido(percentualGramaturaRestante);
  };

  const getOrientacoesAtual = () => {
    const destinoSugerido = getDestinoSugeridoInfo();
    return destinoSugerido ? destinoSugerido.orientacoes : '';
  };

  if (!selectedToner || !peso) {
    return null;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Informações Calculadas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <Label>Peso Vazio</Label>
          <div className="font-medium">{selectedToner.peso_vazio}g</div>
        </div>
        <div>
          <Label>Peso Atual</Label>
          <div className="font-medium">{peso}g</div>
        </div>
        <div>
          <Label>Gramatura Restante</Label>
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {calculateGramaturaRestante().toFixed(2)}g
          </div>
        </div>
        <div>
          <Label>% Gramatura Restante</Label>
          <div className="font-medium text-green-600 dark:text-green-400">
            {calculatePercentualGramaturaRestante()}%
          </div>
        </div>
      </div>

      {getDestinoSugeridoInfo() && (
        <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-800 dark:text-blue-200">
              Destino Sugerido: {getDestinoSugeridoInfo()?.destino}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Baseado em {calculatePercentualGramaturaRestante()}% de gramatura restante
          </p>
        </div>
      )}

      {getOrientacoesAtual() && (
        <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-800 dark:text-amber-200">
              Orientações
            </span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {getOrientacoesAtual()}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="destino_final">Destino Final *</Label>
        <Select value={destinoFinal} onValueChange={onDestinoChange}>
          <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
            <SelectValue placeholder="Selecione o destino final" />
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

      {calculateValorRecuperado() && (
        <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-800 dark:text-green-200">
              Valor Recuperado Calculado
            </span>
          </div>
          <div className="text-lg font-bold text-green-700 dark:text-green-300">
            R$ {calculateValorRecuperado()}
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Baseado na gramatura restante e valor por folha do toner
          </p>
        </div>
      )}
    </div>
  );
};
