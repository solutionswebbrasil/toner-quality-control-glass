
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
    id: 'descarte',
    destino: 'Descarte',
    percentual_min: 0,
    percentual_max: 20,
    orientacoes: 'Toner com pouca gramatura restante. Recomendado descartar.'
  },
  {
    id: 'uso_interno_teste',
    destino: 'Uso Interno (Teste)',
    percentual_min: 21,
    percentual_max: 39,
    orientacoes: 'Teste o toner: se a qualidade estiver boa, você pode usar internamente. Se estiver ruim, pode descartar.'
  },
  {
    id: 'estoque_semi_novo_teste',
    destino: 'Estoque Semi Novo (Teste)',
    percentual_min: 40,
    percentual_max: 80,
    orientacoes: 'Teste o toner: se a qualidade estiver boa, você pode enviar para o estoque como semi novo. Se estiver ruim, pode enviar para a garantia.'
  },
  {
    id: 'estoque_novo_teste',
    destino: 'Estoque Novo (Teste)',
    percentual_min: 81,
    percentual_max: 100,
    orientacoes: 'Teste o toner: se a qualidade estiver boa, você pode enviar para o estoque como novo. Se estiver ruim, pode enviar para a garantia.'
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

  const restaurarPadrao = () => {
    setRegras(regrasIniciais);
    localStorage.setItem('regras_retornado', JSON.stringify(regrasIniciais));
  };

  const obterDestinoSugerido = (percentualGramaturaRestante: number): RegraRetornado | null => {
    return regras.find(regra => 
      percentualGramaturaRestante >= regra.percentual_min && percentualGramaturaRestante <= regra.percentual_max
    ) || null;
  };

  const obterOrientacoes = (destino: string): string => {
    const regra = regras.find(r => r.destino === destino);
    return regra?.orientacoes || '';
  };

  return {
    regras,
    setRegras,
    obterDestinoSugerido,
    obterOrientacoes,
    carregarRegras,
    restaurarPadrao
  };
};
