
import { retornadoService } from '@/services/retornadoService';
import { tonerService } from '@/services/tonerService';
import { normalizeDate } from './dateNormalizer';


export const processImportData = async (
  data: any[], 
  onProgress?: (imported: number, errors: number) => void
) => {
  console.log('Iniciando importação com dados:', data.length, 'registros');
  
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Usuário não autenticado');
  }
  
  let importedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Verificar se existe pelo menos um toner na base para usar como padrão
  let idTonerPadrao = null;
  try {
    const toners = await tonerService.getAll();
    if (toners.length > 0) {
      idTonerPadrao = toners[0].id;
      console.log(`Usando toner ID ${idTonerPadrao} como padrão para modelos não encontrados`);
    } else {
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
        registrado_por: 0
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
      
      // Validação - aceita id_cliente = 0 para retornados sem identificação
      const idCliente = parseInt(String(item.id_cliente)) || 0;
      if (idCliente < 0) {
        throw new Error(`ID do cliente inválido: ${item.id_cliente}. Use 0 para retornados sem identificação.`);
      }

      // Buscar o ID do modelo na tabela de toners ou usar padrão
      let id_modelo = idTonerPadrao;
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
              registrado_por: 0
            });
            id_modelo = novoToner.id;
            console.log(`Novo toner criado para modelo ${item.modelo} com ID: ${id_modelo}`);
          }
        } catch (modeloError) {
          console.error(`Erro ao buscar/criar modelo ${item.modelo}:`, modeloError);
          console.warn(`Usando ID padrão (${idTonerPadrao}) para o modelo ${item.modelo}`);
        }
      }

      // Processar valor recuperado - garantir que seja numérico
      let valorRecuperado = null;
      if (item.valor_recuperado !== undefined && item.valor_recuperado !== null && item.valor_recuperado !== '') {
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
          valorStr = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }
        
        const valorNumerico = parseFloat(valorStr);
        if (!isNaN(valorNumerico) && valorNumerico >= 0) {
          valorRecuperado = valorNumerico;
          console.log(`Valor recuperado processado: ${item.valor_recuperado} -> ${valorRecuperado}`);
        }
      }

      // Normalizar e validar dados
      const retornadoData = {
        id_cliente: idCliente,
        id_modelo: id_modelo,
        peso: parseFloat(String(item.peso || 100)) || 100, // Peso padrão
        destino_final: String(item.destino_final || 'Estoque').trim(),
        filial: String(item.filial || 'Matriz').trim(),
        valor_recuperado: valorRecuperado,
        data_registro: normalizeDate(item.data_registro),
        user_id: user.id
      };

      console.log(`Dados preparados para importação item ${index + 1}:`, retornadoData);
      
      // Criar o registro
      const novoRetornado = await retornadoService.create(retornadoData);
      console.log(`Item ${index + 1} importado com sucesso:`, novoRetornado);
      
      importedCount++;
      
      // Atualizar progresso a cada 50 registros para melhor performance
      if ((importedCount + errorCount) % 50 === 0) {
        onProgress?.(importedCount, errorCount);
      }
      
    } catch (error) {
      console.error(`Erro ao importar item ${index + 1}:`, item, error);
      errorCount++;
      errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      
      // Atualizar progresso a cada 50 registros para melhor performance
      if ((importedCount + errorCount) % 50 === 0) {
        onProgress?.(importedCount, errorCount);
      }
    }
  }

  // Progresso final
  onProgress?.(importedCount, errorCount);
  
  console.log(`Importação finalizada: ${importedCount} sucessos, ${errorCount} erros`);
  return { importedCount, errorCount, errors };
};
