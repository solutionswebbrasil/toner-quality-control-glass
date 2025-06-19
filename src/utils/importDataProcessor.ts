
import { tonerService } from '@/services/tonerService';
import { retornadoService } from '@/services/retornadoService';
import { Toner, Retornado, RetornadoCSV } from '@/types';

export const processTonerImport = async (csvData: any[], userId: string): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  for (let i = 0; i < csvData.length; i++) {
    try {
      const row = csvData[i];
      
      // Validar dados obrigatórios
      if (!row.modelo || !row.cor) {
        results.errors.push(`Linha ${i + 1}: Modelo e cor são obrigatórios`);
        continue;
      }

      const tonerData: Omit<Toner, 'id' | 'user_id' | 'data_registro'> = {
        modelo: row.modelo,
        peso_cheio: parseFloat(row.peso_cheio) || 0,
        peso_vazio: parseFloat(row.peso_vazio) || 0,
        gramatura: parseFloat(row.gramatura) || 0,
        preco_produto: parseFloat(row.preco_produto) || 0,
        capacidade_folhas: parseInt(row.capacidade_folhas) || 0,
        valor_por_folha: parseFloat(row.valor_por_folha) || 0,
        impressoras_compat: row.impressoras_compat || '',
        cor: row.cor,
        registrado_por: parseInt(row.registrado_por) || 1
      };

      await tonerService.create({
        ...tonerData,
        user_id: userId
      });
      
      results.success++;
    } catch (error) {
      results.errors.push(`Linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return results;
};

export const processRetornadoImport = async (csvData: RetornadoCSV[], userId: string): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  // Buscar todos os toners para fazer o mapeamento
  const toners = await tonerService.getAll();
  const tonerMap = new Map(toners.map(t => [t.modelo.toLowerCase(), t.id!]));

  for (let i = 0; i < csvData.length; i++) {
    try {
      const row = csvData[i];
      
      // Validar dados obrigatórios
      if (!row.modelo || !row.destino_final) {
        results.errors.push(`Linha ${i + 1}: Modelo e destino final são obrigatórios`);
        continue;
      }

      // Buscar ID do modelo
      const modeloId = tonerMap.get(row.modelo.toLowerCase());
      if (!modeloId) {
        results.errors.push(`Linha ${i + 1}: Modelo "${row.modelo}" não encontrado`);
        continue;
      }

      // Validar destino final
      const destinosValidos = ['Descarte', 'Garantia', 'Estoque', 'Uso Interno'];
      if (!destinosValidos.includes(row.destino_final)) {
        results.errors.push(`Linha ${i + 1}: Destino final deve ser um dos: ${destinosValidos.join(', ')}`);
        continue;
      }

      const retornadoData = {
        id_cliente: row.id_cliente,
        id_modelo: modeloId,
        peso: 0, // Valor padrão
        destino_final: row.destino_final,
        filial: row.filial,
        valor_recuperado: 0, // Valor padrão
        user_id: userId,
        data_registro: new Date().toISOString()
      };

      await retornadoService.create(retornadoData);
      results.success++;
    } catch (error) {
      results.errors.push(`Linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return results;
};

// Funções auxiliares para validação
export const validateTonerData = (data: any): boolean => {
  return !!(data.modelo && data.cor);
};

export const findTonerIdByModel = (modelo: string, toners: Toner[]): number | null => {
  const toner = toners.find(t => t.modelo.toLowerCase() === modelo.toLowerCase());
  return toner?.id || null;
};

export const validateRetornadoData = (data: any): boolean => {
  const destinosValidos = ['Descarte', 'Garantia', 'Estoque', 'Uso Interno'];
  return !!(data.modelo && data.destino_final && destinosValidos.includes(data.destino_final));
};
