
import { useState, useEffect } from 'react';

export interface RegraRetornado {
  id: string;
  destino: string;
  percentual_min: number;
  percentual_max: number;
  orientacoes: string;
}

const regrasIniciais: RegraRetornado[] = [
  {
    id: 'estoque',
    destino: 'Estoque',
    percentual_min: 0,
    percentual_max: 30,
    orientacoes: 'Toners com baixo uso, adequados para reuso futuro. Verificar condições de armazenamento.'
  },
  {
    id: 'uso_interno',
    destino: 'Uso Interno',
    percentual_min: 31,
    percentual_max: 70,
    orientacoes: 'Toners com uso moderado, utilizáveis para impressões internas e testes.'
  },
  {
    id: 'garantia',
    destino: 'Garantia',
    percentual_min: 71,
    percentual_max: 90,
    orientacoes: 'Toners com alto uso, verificar se ainda estão no período de garantia.'
  },
  {
    id: 'descarte',
    destino: 'Descarte',
    percentual_min: 91,
    percentual_max: 100,
    orientacoes: 'Toners com uso muito alto, destinados ao descarte ecológico adequado.'
  }
];

export const useRegrasRetornado = () => {
  const [regras, setRegras] = useState<RegraRetornado[]>(regrasIniciais);

  useEffect(() => {
    carregarRegras();
  }, []);

  const carregarRegras = () => {
    const regrasStorage = localStorage.getItem('regras_retornado');
    if (regrasStorage) {
      setRegras(JSON.parse(regrasStorage));
    }
  };

  const obterDestinoSugerido = (percentualUso: number): RegraRetornado | null => {
    return regras.find(regra => 
      percentualUso >= regra.percentual_min && percentualUso <= regra.percentual_max
    ) || null;
  };

  const obterOrientacoes = (destino: string): string => {
    const regra = regras.find(r => r.destino === destino);
    return regra?.orientacoes || '';
  };

  return {
    regras,
    obterDestinoSugerido,
    obterOrientacoes,
    carregarRegras
  };
};
