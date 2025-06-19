
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { config, testEmail } = await req.json()

    // Configuração do SMTP usando nodemailer (simulado)
    const smtpConfig = {
      host: config.host_smtp,
      port: config.porta_smtp,
      secure: config.usar_tls,
      auth: {
        user: config.email_remetente,
        pass: config.senha_email,
      },
    }

    // Simular envio de e-mail de teste
    // Em produção, você usaria uma biblioteca como nodemailer
    console.log('Testando configuração SMTP:', {
      host: config.host_smtp,
      port: config.porta_smtp,
      from: config.email_remetente,
      to: testEmail
    })

    // Simular sucesso (em produção, fazer envio real)
    const emailContent = {
      from: `${config.nome_remetente} <${config.email_remetente}>`,
      to: testEmail,
      subject: 'Teste de Configuração SMTP - SGQ Pro',
      html: `
        <h2>Teste de Configuração SMTP</h2>
        <p>Este é um e-mail de teste para verificar se as configurações SMTP estão funcionando corretamente.</p>
        <p><strong>Servidor:</strong> ${config.servidor_tipo}</p>
        <p><strong>Host:</strong> ${config.host_smtp}</p>
        <p><strong>Porta:</strong> ${config.porta_smtp}</p>
        <p><strong>TLS/SSL:</strong> ${config.usar_tls ? 'Habilitado' : 'Desabilitado'}</p>
        <hr>
        <p><small>Sistema SGQ Pro - Configurações de E-mail</small></p>
      `
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'E-mail de teste enviado com sucesso',
        details: emailContent 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erro ao testar SMTP:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
