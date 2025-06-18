
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
    console.log('📊 Dados:', data);
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

  create: async (auditoria: Omit<Auditoria, 'id'>): Promise<Auditoria> => {
    console.log('📝 Criando nova auditoria:', auditoria);
    
    const { data, error } = await supabase
      .from('auditorias')
      .insert([auditoria])
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
    
    const { data, error } = await supabase
      .from('auditorias')
      .update(auditoria)
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
