
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
        cor: '',
        impressoras_compat: '',
        peso_vazio: 0,
        peso_cheio: 0,
        gramatura: 0,
        capacidade_folhas: 0,
        preco_produto: 0,
        valor_por_folha: 0,
        registrado_por: 0,
        data_registro: new Date().toISOString()
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

      // Buscar o ID do modelo na tabela de toners ou criar novo se não existir
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
            // Criar novo toner automaticamente
            console.log(`Modelo ${item.modelo} não encontrado, criando novo toner...`);
            const novoToner = await tonerService.create({
              modelo: item.modelo.trim(),
              cor: '',
              impressoras_compat: '',
              peso_vazio: 0,
              peso_cheio: 0,
              gramatura: 0,
              capacidade_folhas: 0,
              preco_produto: 0,
              valor_por_folha: 0,
              registrado_por: 0,
              data_registro: new Date().toISOString()
            });
            id_modelo = novoToner.id;
            console.log(`Novo toner criado para modelo ${item.modelo} com ID: ${id_modelo}`);
          }
        } catch (modeloError) {
          console.error(`Erro ao buscar/criar modelo ${item.modelo}:`, modeloError);
          console.warn(`Usando ID padrão (${idTonerPadrao}) para o modelo ${item.modelo}`);
        }
      }

      // Processar valor recuperado da planilha
      let valorRecuperado = null;
      if (item.valor_recuperado !== undefined && item.valor_recuperado !== null && item.valor_recuperado !== '') {
        // Converter valores em formato brasileiro para número
        let valorStr = String(item.valor_recuperado);
        
        // Remover "R$" e espaços
        valorStr = valorStr.replace(/R\$\s*/g, '');
        
        // Substituir vírgula por ponto para decimais
        if (valorStr.includes(',') && !valorStr.includes('.')) {
          valorStr = valorStr.replace(',', '.');
        }
        
        // Remover pontos de milhares (mantém apenas o último ponto para decimais)
        const parts = valorStr.split('.');
        if (parts.length > 2) {
          // Se há mais de um ponto, os primeiros são separadores de milhares
          valorStr = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }
        
        const valorNumerico = parseFloat(valorStr);
        if (!isNaN(valorNumerico) && valorNumerico > 0) {
          valorRecuperado = valorNumerico;
          console.log(`Valor recuperado processado: ${item.valor_recuperado} -> ${valorRecuperado}`);
        }
      }

      // Normalizar e validar dados
      const retornadoData = {
        id_cliente: idCliente,
        id_modelo: id_modelo,
        peso: 100, // Peso padrão fixo, já que não é obrigatório na planilha
        destino_final: String(item.destino_final || 'Estoque').trim(),
        filial: String(item.filial || 'Matriz').trim(),
        valor_recuperado: valorRecuperado,
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
