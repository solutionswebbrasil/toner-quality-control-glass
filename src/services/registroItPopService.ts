
import { supabase } from '@/integrations/supabase/client';
import type { RegistroItPop } from '@/types';

export const registroItPopService = {
  getAll: async (): Promise<RegistroItPop[]> => {
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar registros IT/POP:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      titulo: item.titulos_itpop?.titulo || 'N/A'
    }));
  },

  getById: async (id: number): Promise<RegistroItPop | undefined> => {
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar registro IT/POP:', error);
      return undefined;
    }
    
    return {
      ...data,
      titulo: data.titulos_itpop?.titulo || 'N/A'
    };
  },

  create: async (registro: Omit<RegistroItPop, 'id'>): Promise<RegistroItPop> => {
    const { data, error } = await supabase
      .from('registros_itpop')
      .insert([registro])
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao criar registro IT/POP:', error);
      throw error;
    }
    
    return {
      ...data,
      titulo: data.titulos_itpop?.titulo || 'N/A'
    };
  },

  update: async (id: number, registro: Partial<RegistroItPop>): Promise<RegistroItPop | null> => {
    const { data, error } = await supabase
      .from('registros_itpop')
      .update(registro)
      .eq('id', id)
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao atualizar registro IT/POP:', error);
      return null;
    }
    
    return {
      ...data,
      titulo: data.titulos_itpop?.titulo || 'N/A'
    };
  },

  delete: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('registros_itpop')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar registro IT/POP:', error);
      return false;
    }
    
    return true;
  }
};
