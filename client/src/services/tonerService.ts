

import type { Toner } from '@/types';

// Função para adicionar parâmetros anti-cache
const addNoCacheParams = () => `?_t=${Date.now()}&_r=${Math.random()}`;

export const tonerService = {
  getAll: async (): Promise<Toner[]> => {
    // Adiciona cabeçalhos anti-cache
    const { data, error } = await supabase
      .from('toners')
      .select('*')
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar toners:', error);
      throw error;
    }
    
    return data || [];
  },

  getById: async (id: number): Promise<Toner | undefined> => {
    const { data, error } = await supabase
      .from('toners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar toner:', error);
      return undefined;
    }
    
    return data;
  },

  create: async (toner: Omit<Toner, 'id' | 'user_id' | 'data_registro'>): Promise<Toner> => {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const tonerData = {
      ...toner,
      user_id: user.id,
      data_registro: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('toners')
      .insert([tonerData])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar toner:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, toner: Partial<Toner>): Promise<Toner | null> => {
    const { data, error } = await supabase
      .from('toners')
      .update(toner)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar toner:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('toners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar toner:', error);
      return false;
    }
    
    return true;
  }
};
