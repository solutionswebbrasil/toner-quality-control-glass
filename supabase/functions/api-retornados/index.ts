
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per 15 minutes

  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const clientData = rateLimitMap.get(clientId);
  
  if (now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (clientData.count >= maxRequests) {
    return false;
  }

  clientData.count++;
  return true;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '900' // 15 minutes
          },
        }
      );
    }

    // Basic API key authentication (optional for Power BI access)
    const apiKey = req.headers.get('x-api-key');
    if (apiKey && apiKey !== 'powerbi-access-2024') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid API key'
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('API Retornados: Iniciando consulta dos dados...');

    // Buscar todos os retornados com informações dos toners
    const { data: retornados, error } = await supabase
      .from('retornados')
      .select(`
        id,
        id_cliente,
        filial,
        destino_final,
        peso,
        data_registro,
        valor_recuperado,
        toners!inner(
          modelo,
          peso_vazio,
          gramatura,
          capacidade_folhas,
          valor_por_folha,
          cor,
          impressoras_compat
        )
      `)
      .order('data_registro', { ascending: false });

    if (error) {
      console.error('Erro ao buscar retornados:', error);
      throw error;
    }

    console.log(`API Retornados: ${retornados?.length || 0} registros encontrados`);

    // Audit log for API access
    console.log(`API Access: ${clientIp} at ${new Date().toISOString()}`);

    // Transformar os dados para um formato mais adequado para Power BI
    const dadosFormatados = retornados?.map(item => {
      // Calcular valor recuperado se destino for estoque/estoque semi novo
      let valorRecuperadoCalculado = item.valor_recuperado;
      
      if ((item.destino_final === 'Estoque' || item.destino_final === 'Estoque Semi Novo') && item.toners) {
        const gramaturaRestante = item.peso - item.toners.peso_vazio;
        const percentualGramatura = (gramaturaRestante / item.toners.gramatura) * 100;
        const folhasRestantes = Math.max(0, (percentualGramatura / 100) * item.toners.capacidade_folhas);
        valorRecuperadoCalculado = Math.max(0, folhasRestantes * item.toners.valor_por_folha);
      }

      return {
        id: item.id,
        id_cliente: item.id_cliente,
        modelo_toner: item.toners?.modelo || '',
        cor_toner: item.toners?.cor || '',
        impressoras_compativel: item.toners?.impressoras_compat || '',
        filial: item.filial,
        destino_final: item.destino_final,
        peso_atual: item.peso,
        peso_vazio_toner: item.toners?.peso_vazio || 0,
        gramatura_total: item.toners?.gramatura || 0,
        capacidade_folhas: item.toners?.capacidade_folhas || 0,
        valor_por_folha: item.toners?.valor_por_folha || 0,
        valor_recuperado: valorRecuperadoCalculado || 0,
        data_registro: item.data_registro,
        ano: new Date(item.data_registro).getFullYear(),
        mes: new Date(item.data_registro).getMonth() + 1,
        mes_nome: new Date(item.data_registro).toLocaleDateString('pt-BR', { month: 'long' }),
        trimestre: Math.ceil((new Date(item.data_registro).getMonth() + 1) / 3)
      };
    }) || [];

    return new Response(
      JSON.stringify({
        success: true,
        total_registros: dadosFormatados.length,
        data_atualizacao: new Date().toISOString(),
        dados: dadosFormatados
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Erro na API de retornados:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
