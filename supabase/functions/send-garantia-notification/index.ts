
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GarantiaNotificationRequest {
  email: string;
  garantia: {
    id: number;
    item: string;
    quantidade: number;
    defeito: string;
    status: string;
    resultado?: string;
    valor_unitario: number;
    valor_total: number;
    data_registro: string;
    ns?: string;
    nf_compra_pdf?: string;
    nf_remessa_pdf?: string;
    nf_devolucao_pdf?: string;
    fornecedor?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, garantia }: GarantiaNotificationRequest = await req.json();

    if (!email || !garantia) {
      return new Response(
        JSON.stringify({ error: "Email e dados da garantia são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Preparar anexos
    const attachments = [];
    
    if (garantia.nf_compra_pdf) {
      try {
        const response = await fetch(garantia.nf_compra_pdf);
        const buffer = await response.arrayBuffer();
        attachments.push({
          filename: `nf_compra_garantia_${garantia.id}.pdf`,
          content: Array.from(new Uint8Array(buffer)),
        });
      } catch (error) {
        console.error("Erro ao anexar NF Compra:", error);
      }
    }

    if (garantia.nf_remessa_pdf) {
      try {
        const response = await fetch(garantia.nf_remessa_pdf);
        const buffer = await response.arrayBuffer();
        attachments.push({
          filename: `nf_remessa_garantia_${garantia.id}.pdf`,
          content: Array.from(new Uint8Array(buffer)),
        });
      } catch (error) {
        console.error("Erro ao anexar NF Remessa:", error);
      }
    }

    if (garantia.nf_devolucao_pdf) {
      try {
        const response = await fetch(garantia.nf_devolucao_pdf);
        const buffer = await response.arrayBuffer();
        attachments.push({
          filename: `nf_devolucao_garantia_${garantia.id}.pdf`,
          content: Array.from(new Uint8Array(buffer)),
        });
      } catch (error) {
        console.error("Erro ao anexar NF Devolução:", error);
      }
    }

    // Criar conteúdo HTML do email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Garantia Finalizada - ID #${garantia.id}
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Resumo da Garantia</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Item:</td>
              <td style="padding: 8px 0; color: #6b7280;">${garantia.item}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Quantidade:</td>
              <td style="padding: 8px 0; color: #6b7280;">${garantia.quantidade}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Defeito:</td>
              <td style="padding: 8px 0; color: #6b7280;">${garantia.defeito}</td>
            </tr>
            ${garantia.ns ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Número de Série:</td>
              <td style="padding: 8px 0; color: #6b7280;">${garantia.ns}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Status:</td>
              <td style="padding: 8px 0; color: #059669; font-weight: bold;">${garantia.status}</td>
            </tr>
            ${garantia.resultado ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Resultado:</td>
              <td style="padding: 8px 0; color: #6b7280;">${garantia.resultado}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Valor Unitário:</td>
              <td style="padding: 8px 0; color: #6b7280;">R$ ${garantia.valor_unitario.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Valor Total:</td>
              <td style="padding: 8px 0; color: #6b7280;">R$ ${garantia.valor_total.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Data Registro:</td>
              <td style="padding: 8px 0; color: #6b7280;">${new Date(garantia.data_registro).toLocaleDateString('pt-BR')}</td>
            </tr>
            ${garantia.fornecedor ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Fornecedor:</td>
              <td style="padding: 8px 0; color: #6b7280;">${garantia.fornecedor}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${attachments.length > 0 ? `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>📎 Documentos em anexo:</strong> ${attachments.length} arquivo(s) PDF
          </p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Esta é uma notificação automática do sistema de garantias.</p>
          <p>Em caso de dúvidas, entre em contato com o responsável.</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Sistema de Garantias <noreply@suaempresa.com>",
      to: [email],
      subject: `Garantia Finalizada - ${garantia.item} (ID: ${garantia.id})`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log("Email de garantia enviado:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email de garantia:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
