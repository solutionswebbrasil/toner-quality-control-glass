
import { supabase } from '@/integrations/supabase/client';
import type { Filial } from '@/types/filial';

export const filialService = {
  getAll: async (): Promise<Filial[]> => {
    console.log('🔍 Buscando todas as filiais...');
    const { data, error } = await supabase
      .from('filiais')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });
    
    if (error) {
      console.error('❌ Erro ao buscar filiais:', error);
      throw error;
    }
    
    console.log('✅ Filiais encontradas:', data?.length || 0);
    return data || [];
  },

  create: async (filial: Omit<Filial, 'id' | 'data_cadastro' | 'user_id'>): Promise<Filial> => {
    console.log('📝 Criando nova filial:', filial);
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const filialWithUser = {
      ...filial,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('filiais')
      .insert([filialWithUser])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar filial:', error);
      throw error;
    }
    
    console.log('✅ Filial criada com sucesso:', data);
    return data;
  },

  update: async (id: number, filial: Partial<Filial>): Promise<Filial | null> => {
    console.log('📝 Atualizando filial:', id, filial);
    
    // Remove user_id from update data to prevent unauthorized changes
    const { user_id, ...updateData } = filial;
    
    const { data, error } = await supabase
      .from('filiais')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar filial:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando filial:', id);
    
    // Marcar como inativo ao invés de deletar fisicamente
    const { error } = await supabase
      .from('filiais')
      .update({ ativo: false })
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar filial:', error);
      return false;
    }
    
    console.log('✅ Filial deletada');
    return true;
  }
};
