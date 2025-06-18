
import { supabase } from '@/integrations/supabase/client';
import type { Retornado } from '@/types';

export const retornadoService = {
  getAll: async (): Promise<Retornado[]> => {
    console.log('🔍 Buscando todos os retornados...');
    const { data, error } = await supabase
      .from('retornados')
      .select('*')
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar retornados:', error);
      throw error;
    }
    
    console.log('✅ Retornados encontrados:', data?.length || 0);
    return data || [];
  },

  getById: async (id: number): Promise<Retornado | undefined> => {
    console.log('🔍 Buscando retornado por ID:', id);
    const { data, error } = await supabase
      .from('retornados')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar retornado:', error);
      return undefined;
    }
    
    console.log('✅ Retornado encontrado:', data);
    return data;
  },

  create: async (retornado: Omit<Retornado, 'id' | 'data_registro' | 'user_id'>): Promise<Retornado> => {
    console.log('📝 Criando novo retornado:', retornado);
    
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const retornadoWithUser = {
      ...retornado,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('retornados')
      .insert([retornadoWithUser])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar retornado:', error);
      throw error;
    }
    
    console.log('✅ Retornado criado com sucesso:', data);
    return data;
  },

  update: async (id: number, retornado: Partial<Retornado>): Promise<Retornado | null> => {
    console.log('📝 Atualizando retornado:', id, retornado);
    
    // Remove user_id from update data to prevent unauthorized changes
    const { user_id, ...updateData } = retornado;
    
    const { data, error } = await supabase
      .from('retornados')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar retornado:', error);
      return null;
    }
    
    console.log('✅ Retornado atualizado:', data);
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando retornado:', id);
    
    const { error } = await supabase
      .from('retornados')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar retornado:', error);
      return false;
    }
    
    console.log('✅ Retornado deletado');
    return true;
  },

  deleteAll: async (): Promise<boolean> => {
    console.log('🗑️ Deletando TODOS os retornados...');
    
    // Additional security check - this should only be allowed for admin users
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('retornados')
      .delete()
      .neq('id', 0); // Delete all records (using neq with impossible condition to match all)
    
    if (error) {
      console.error('❌ Erro ao deletar todos os retornados:', error);
      throw error;
    }
    
    console.log('✅ Todos os retornados foram deletados');
    return true;
  }
};
