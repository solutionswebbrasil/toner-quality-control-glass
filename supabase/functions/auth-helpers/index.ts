
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, ...params } = await req.json();

    switch (action) {
      case 'verify_login':
        const { data: loginResult, error: loginError } = await supabase.rpc('verify_password', {
          input_password: params.input_senha,
          stored_hash: params.stored_hash
        });

        if (loginError) throw loginError;

        if (loginResult) {
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', params.input_usuario)
            .single();

          if (userError) throw userError;

          return new Response(JSON.stringify([userData]), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify([]), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

      case 'create_user_with_hashed_password':
        const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
          password: params.input_senha
        });

        if (hashError) throw hashError;

        const { data: newUser, error: createError } = await supabase
          .from('usuarios')
          .insert({
            nome_completo: params.input_nome,
            usuario: params.input_usuario,
            senha: hashedPassword
          })
          .select()
          .single();

        if (createError) throw createError;

        return new Response(JSON.stringify(newUser), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Auth helper error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
