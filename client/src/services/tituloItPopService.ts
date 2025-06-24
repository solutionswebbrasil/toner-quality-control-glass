
import { supabase } from '@/integrations/supabase/client';
import type { TituloItPop } from '@/types';

export const tituloItPopService = {
  async getAll(): Promise<TituloItPop[]> {
    const { data, error } = await supabase
      .from('titulos_itpop')
      .select('*')
      .order('data_cadastro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar títulos IT/POP: ${error.message}`);
    }

    return data || [];
  },

  async create(titulo: Omit<TituloItPop, 'id' | 'data_cadastro'>): Promise<TituloItPop> {
    const { data, error } = await supabase
      .from('titulos_itpop')
      .insert(titulo)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar título IT/POP: ${error.message}`);
    }

    return data;
  },

  async update(id: number, titulo: Partial<TituloItPop>): Promise<TituloItPop | null> {
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

  async delete(id: number): Promise<boolean> {
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
