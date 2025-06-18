
import { tonerService } from '@/services/tonerService';
import { retornadoService } from '@/services/retornadoService';
import type { Toner, Retornado } from '@/types';

interface ImportRow {
  [key: string]: any;
}

export const processImportData = async (
  data: ImportRow[],
  type: 'toners' | 'retornados'
): Promise<{ success: number; errors: string[] }> => {
  let success = 0;
  const errors: string[] = [];

  for (const [index, row] of data.entries()) {
    try {
      if (type === 'toners') {
        const toner: Omit<Toner, 'id' | 'user_id' | 'data_registro'> = {
          modelo: String(row.modelo || ''),
          cor: String(row.cor || ''),
          peso_cheio: Number(row.peso_cheio || 0),
          peso_vazio: Number(row.peso_vazio || 0),
          gramatura: Number(row.gramatura || 0),
          preco_produto: Number(row.preco_produto || 0),
          capacidade_folhas: Number(row.capacidade_folhas || 0),
          valor_por_folha: Number(row.valor_por_folha || 0),
          impressoras_compat: String(row.impressoras_compat || ''),
          registrado_por: Number(row.registrado_por || 1)
        };

        await tonerService.create(toner);
      } else if (type === 'retornados') {
        const retornado: Omit<Retornado, 'id' | 'user_id' | 'data_registro'> = {
          id_cliente: Number(row.id_cliente || 0),
          id_modelo: Number(row.id_modelo || 0),
          filial: String(row.filial || ''),
          peso: Number(row.peso || 0),
          destino_final: String(row.destino_final || ''),
          valor_recuperado: Number(row.valor_recuperado || 0)
        };

        await retornadoService.create(retornado);
      }

      success++;
    } catch (error) {
      errors.push(`Linha ${index + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return { success, errors };
};

export const generateTemplateData = (type: 'toners' | 'retornados'): ImportRow[] => {
  if (type === 'toners') {
    return [
      {
        modelo: 'CF283A',
        cor: 'Preto',
        peso_cheio: 1.2,
        peso_vazio: 0.8,
        gramatura: 80,
        preco_produto: 150.00,
        capacidade_folhas: 1500,
        valor_por_folha: 0.10,
        impressoras_compat: 'HP LaserJet Pro M125, M126, M127, M128',
        registrado_por: 1
      }
    ];
  } else {
    return [
      {
        id_cliente: 1001,
        id_modelo: 1,
        filial: 'Matriz',
        peso: 0.8,
        destino_final: 'Descarte',
        valor_recuperado: 25.50
      }
    ];
  }
};
