
import { supabase } from '@/integrations/supabase/client';
import { SmtpConfig } from '@/types/smtpConfig';

export const smtpConfigService = {
  async getConfig(): Promise<SmtpConfig | null> {
    const { data, error } = await supabase
      .from('smtp_configuracoes')
      .select('*')
      .eq('ativo', true)
      .single();

    if (error) {
      console.error('Erro ao buscar configuração SMTP:', error);
      return null;
    }

    return data as SmtpConfig;
  },

  async saveConfig(config: Omit<SmtpConfig, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<SmtpConfig> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Desativar configurações anteriores
    await supabase
      .from('smtp_configuracoes')
      .update({ ativo: false })
      .eq('user_id', user.id);

    // Criar nova configuração
    const configData = {
      ...config,
      user_id: user.id,
      ativo: true
    };

    const { data, error } = await supabase
      .from('smtp_configuracoes')
      .insert([configData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar configuração SMTP:', error);
      throw error;
    }

    return data as SmtpConfig;
  },

  async testEmail(config: Omit<SmtpConfig, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'ativo'>, testEmail: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp-config', {
        body: { config, testEmail }
      });

      if (error) {
        console.error('Erro ao testar SMTP:', error);
        return false;
      }

      return data?.success || false;
    } catch (error) {
      console.error('Erro ao testar SMTP:', error);
      return false;
    }
  }
};
