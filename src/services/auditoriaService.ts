
import { supabase } from '@/integrations/supabase/client';
import type { Auditoria } from '@/types';

export const auditoriaService = {
  getAll: async (): Promise<Auditoria[]> => {
    console.log('🔍 Buscando todas as auditorias...');
    const { data, error } = await supabase
      .from('auditorias')
      .select('*')
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar auditorias:', error);
      throw error;
    }
    
    console.log('✅ Auditorias encontradas:', data?.length || 0);
    return data || [];
  },

  getById: async (id: number): Promise<Auditoria | undefined> => {
    console.log('🔍 Buscando auditoria por ID:', id);
    const { data, error } = await supabase
      .from('auditorias')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar auditoria:', error);
      return undefined;
    }
    
    console.log('✅ Auditoria encontrada:', data);
    return data;
  },

  create: async (auditoria: Omit<Auditoria, 'id' | 'data_registro' | 'user_id'>): Promise<Auditoria> => {
    console.log('📝 Criando nova auditoria:', auditoria);
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const auditoriaWithUser = {
      ...auditoria,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('auditorias')
      .insert([auditoriaWithUser])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar auditoria:', error);
      throw error;
    }
    
    console.log('✅ Auditoria criada com sucesso:', data);
    return data;
  },

  update: async (id: number, auditoria: Partial<Auditoria>): Promise<Auditoria | null> => {
    console.log('📝 Atualizando auditoria ID:', id, 'com dados:', auditoria);
    
    // Remove user_id from update data to prevent unauthorized changes
    const { user_id, ...updateData } = auditoria;
    
    const { data, error } = await supabase
      .from('auditorias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar auditoria:', error);
      return null;
    }
    
    console.log('✅ Auditoria atualizada:', data);
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando auditoria ID:', id);
    
    const { error } = await supabase
      .from('auditorias')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar auditoria:', error);
      return false;
    }
    
    console.log('✅ Auditoria deletada com sucesso');
    return true;
  }
};
