
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

  // Verificar se existe pelo menos um toner na base para usar como padrão
  let idTonerPadrao = null;
  try {
    const toners = await tonerService.getAll();
    if (toners.length > 0) {
      idTonerPadrao = toners[0].id; // Usar o primeiro toner como padrão
      console.log(`Usando toner ID ${idTonerPadrao} como padrão para modelos não encontrados`);
    } else {
      // Se não há toners cadastrados, criar um toner padrão
      console.log('Nenhum toner encontrado na base, criando toner padrão...');
      const tonerPadrao = await tonerService.create({
        modelo: 'MODELO_PADRAO_IMPORTACAO',
        cor: 'Preto',
        impressoras_compat: 'Genérica',
        peso_vazio: 100,
        peso_cheio: 200,
        gramatura: 100,
        capacidade_folhas: 1000,
        preco_produto: 50,
        valor_por_folha: 0.05,
        registrado_por: 1
      });
      idTonerPadrao = tonerPadrao.id;
      console.log(`Toner padrão criado com ID ${idTonerPadrao}`);
    }
  } catch (error) {
    console.error('Erro ao verificar/criar toner padrão:', error);
    throw new Error('Não foi possível preparar a base para importação. Verifique se há pelo menos um toner cadastrado.');
  }

  for (const [index, item] of data.entries()) {
    try {
      console.log(`Processando item ${index + 1}:`, item);
      
      // Validação ajustada - aceita id_cliente = 0 para retornados sem identificação
      const idCliente = parseInt(String(item.id_cliente)) || 0;
      if (idCliente < 0) {
        throw new Error(`ID do cliente inválido: ${item.id_cliente}. Use 0 para retornados sem identificação.`);
      }

      // Buscar o ID do modelo na tabela de toners
      let id_modelo = idTonerPadrao; // Usar o ID padrão válido
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
            console.warn(`Modelo ${item.modelo} não encontrado na base de toners, usando ID padrão (${idTonerPadrao})`);
          }
        } catch (modeloError) {
          console.error(`Erro ao buscar modelo ${item.modelo}:`, modeloError);
          console.warn(`Usando ID padrão (${idTonerPadrao}) para o modelo ${item.modelo}`);
        }
      }

      // Normalizar e validar dados
      const retornadoData = {
        id_cliente: idCliente,
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
