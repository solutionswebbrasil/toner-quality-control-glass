
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('API Retornados: Iniciando consulta dos dados...');

    // Buscar TODOS os dados sem limitação usando paginação
    let allData: any[] = [];
    const batchSize = 1000;
    let offset = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      console.log(`API Retornados: Buscando lote ${Math.floor(offset / batchSize) + 1} (offset: ${offset})...`);
      
      const { data, error, count } = await supabase
        .from('retornados')
        .select(`
          *,
          toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha)
        `, { count: 'exact' })
        .range(offset, offset + batchSize - 1)
        .order('data_registro', { ascending: false });

      if (error) {
        console.error('API Retornados: Erro na consulta:', error);
        throw error;
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

      // Log do total na primeira consulta
      if (offset === 0 && count !== null) {
        console.log(`API Retornados: Total de registros no banco: ${count}`);
      }
    }

    console.log(`API Retornados: ${allData.length} registros encontrados`);

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

      return {
        ...item,
        modelo: item.toners.modelo,
        valor_recuperado: valorRecuperadoCalculado,
        // Campos adicionais para cálculos
        peso_vazio: item.toners.peso_vazio,
        gramatura: item.toners.gramatura,
        capacidade_folhas: item.toners.capacidade_folhas,
        valor_por_folha: item.toners.valor_por_folha,
      };
    });

    // Log para audit/debugging
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    console.log(`API Access: ${clientIP} at ${new Date().toISOString()}`);

    return new Response(JSON.stringify(transformedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Retornados: Erro geral:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
