
import { retornadoService } from '@/services/retornadoService';
import { tonerService } from '@/services/tonerService';
import { normalizeDate } from './dateNormalizer';

export const processImportData = async (
  data: any[], 
  onProgress?: (imported: number, errors: number) => void
) => {
  console.log('Iniciando importação com dados:', data);
  
  let importedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const [index, item] of data.entries()) {
    try {
      console.log(`Processando item ${index + 1}:`, item);
      
      // Validação mais rigorosa dos dados
      if (!item.id_cliente || item.id_cliente <= 0) {
        throw new Error(`ID do cliente inválido: ${item.id_cliente}`);
      }

      // Buscar o ID do modelo na tabela de toners
      let id_modelo = 1; // ID padrão
      if (item.modelo && typeof item.modelo === 'string') {
        try {
          const toners = await tonerService.getAll();
          const tonerEncontrado = toners.find(toner => 
            toner.modelo.toLowerCase().trim() === item.modelo.toLowerCase().trim()
          );
          
          if (tonerEncontrado) {
            id_modelo = tonerEncontrado.id;
            console.log(`Modelo ${item.modelo} encontrado com ID: ${id_modelo}`);
          } else {
            console.warn(`Modelo ${item.modelo} não encontrado na base de toners, usando ID padrão`);
            errors.push(`Linha ${index + 1}: Modelo "${item.modelo}" não encontrado na base de dados`);
            errorCount++;
            onProgress?.(importedCount, errorCount);
            continue; // Pular este item se o modelo não for encontrado
          }
        } catch (modeloError) {
          console.error(`Erro ao buscar modelo ${item.modelo}:`, modeloError);
          errors.push(`Linha ${index + 1}: Erro ao buscar modelo "${item.modelo}"`);
          errorCount++;
          onProgress?.(importedCount, errorCount);
          continue;
        }
      }

      // Normalizar e validar dados
      const retornadoData = {
        id_cliente: parseInt(String(item.id_cliente)) || 1,
        id_modelo: id_modelo,
        peso: 100, // Peso padrão fixo, já que não é obrigatório na planilha
        destino_final: String(item.destino_final || 'Estoque').trim(),
        filial: String(item.filial || 'Matriz').trim(),
        valor_recuperado: item.valor_recuperado ? parseFloat(String(item.valor_recuperado)) : null,
        data_registro: normalizeDate(item.data_registro)
      };

      console.log(`Dados preparados para importação item ${index + 1}:`, retornadoData);
      
      const novoRetornado = await retornadoService.create(retornadoData);
      console.log(`Item ${index + 1} importado com sucesso:`, novoRetornado);
      
      importedCount++;
      onProgress?.(importedCount, errorCount);
    } catch (error) {
      console.error(`Erro ao importar item ${index + 1}:`, item, error);
      errorCount++;
      errors.push(`Linha ${index + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      onProgress?.(importedCount, errorCount);
    }
  }

  return { importedCount, errorCount, errors };
};
