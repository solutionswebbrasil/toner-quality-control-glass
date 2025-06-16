
import { supabase } from '@/integrations/supabase/client';
import type { TituloItPop } from '@/types';

export const tituloItPopService = {
  getAll: async (): Promise<TituloItPop[]> => {
    const { data, error } = await supabase
      .from('titulos_itpop')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar títulos IT/POP:', error);
      throw error;
    }
    
    return data || [];
  },

  getById: async (id: number): Promise<TituloItPop | undefined> => {
    const { data, error } = await supabase
      .from('titulos_itpop')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar título IT/POP:', error);
      return undefined;
    }
    
    return data;
  },

  create: async (titulo: Omit<TituloItPop, 'id'>): Promise<TituloItPop> => {
    const { data, error } = await supabase
      .from('titulos_itpop')
      .insert([titulo])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar título IT/POP:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, titulo: Partial<TituloItPop>): Promise<TituloItPop | null> => {
    const { data, error } = await supabase
      .from('titulos_itpop')
      .update(titulo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar título IT/POP:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('titulos_itpop')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar título IT/POP:', error);
      return false;
    }
    
    return true;
  }
};
