
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('API Retornados: Iniciando busca de dados...');

    // Verificar autenticação por API Key (opcional)
    const apiKey = req.headers.get('X-API-Key');
    if (apiKey && apiKey !== 'powerbi-access-2024') {
      console.log('API Key inválida fornecida:', apiKey);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'API Key inválida',
          total_registros: 0,
          dados: []
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Buscar TODOS os dados usando paginação em lotes
    let allData: any[] = [];
    const batchSize = 1000;
    let offset = 0;
    let hasMoreData = true;
    let totalCount = 0;

    while (hasMoreData) {
      console.log(`API Retornados: Buscando lote ${Math.floor(offset / batchSize) + 1} (offset: ${offset})...`);
      
      const { data, error, count } = await supabase
        .from('retornados')
        .select(`
          *,
          toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha, cor)
        `, { count: 'exact' })
        .range(offset, offset + batchSize - 1)
        .order('data_registro', { ascending: false });

      if (error) {
        console.error('API Retornados: Erro na consulta:', error);
        throw error;
      }

      // Capturar o total na primeira consulta
      if (offset === 0 && count !== null) {
        totalCount = count;
        console.log(`API Retornados: Total de registros no banco: ${totalCount}`);
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        console.log(`API Retornados: Lote ${Math.floor(offset / batchSize) + 1} carregado: ${data.length} registros. Total acumulado: ${allData.length}`);
        
        // Se retornou menos que o batch size, não há mais dados
        if (data.length < batchSize) {
          hasMoreData = false;
        } else {
          offset += batchSize;
        }
      } else {
        hasMoreData = false;
      }
    }

    console.log(`API Retornados: CARREGAMENTO COMPLETO: ${allData.length} registros carregados de ${totalCount} no banco`);

    // Transform data to include modelo and calculated valor_recuperado
    const transformedData = allData.map(item => {
      let valorRecuperadoCalculado = item.valor_recuperado;

      // Calcular valor recuperado se destino for estoque e não tiver valor já calculado
      if ((item.destino_final === 'Estoque' || item.destino_final === 'Estoque Semi Novo') && !item.valor_recuperado) {
        const gramaturaRestante = item.peso - item.toners.peso_vazio;
        const percentualGramatura = (gramaturaRestante / item.toners.gramatura) * 100;
        const folhasRestantes = (percentualGramatura / 100) * item.toners.capacidade_folhas;
        valorRecuperadoCalculado = folhasRestantes * item.toners.valor_por_folha;
      }

      // Extrair ano, mês e trimestre da data
      const dataRegistro = new Date(item.data_registro);
      const ano = dataRegistro.getFullYear();
      const mes = dataRegistro.getMonth() + 1;
      const trimestre = Math.ceil(mes / 3);
      
      // Array com nomes dos meses
      const mesesNomes = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];

      return {
        id: item.id,
        id_cliente: item.id_cliente,
        modelo_toner: item.toners.modelo,
        cor_toner: item.toners.cor || 'N/A',
        filial: item.filial,
        destino_final: item.destino_final,
        valor_recuperado: valorRecuperadoCalculado,
        data_registro: item.data_registro.split('T')[0], // Formato YYYY-MM-DD
        ano: ano,
        mes: mes,
        mes_nome: mesesNomes[mes - 1],
        trimestre: trimestre,
        peso: item.peso,
        peso_vazio: item.toners.peso_vazio,
        gramatura: item.toners.gramatura,
        capacidade_folhas: item.toners.capacidade_folhas,
        valor_por_folha: item.toners.valor_por_folha,
      };
    });

    // Resposta no formato esperado pelo Power BI
    const response = {
      success: true,
      total_registros: transformedData.length,
      data_atualizacao: new Date().toISOString(),
      dados: transformedData
    };

    // Log para audit/debugging
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    console.log(`API Access: ${clientIP} at ${new Date().toISOString()} - Retornados: ${transformedData.length} registros`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Retornados: Erro geral:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro interno do servidor',
        message: error.message,
        total_registros: 0,
        dados: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
