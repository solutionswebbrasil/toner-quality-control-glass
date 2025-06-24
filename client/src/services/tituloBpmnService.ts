
import { supabase } from '@/integrations/supabase/client';
import type { TituloBpmn } from '@/types';

export const tituloBpmnService = {
  async getAll(): Promise<TituloBpmn[]> {
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .select('*')
      .order('data_cadastro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar títulos BPMN: ${error.message}`);
    }

    return data || [];
  },

  async create(titulo: Omit<TituloBpmn, 'id' | 'data_cadastro'>): Promise<TituloBpmn> {
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .insert(titulo)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar título BPMN: ${error.message}`);
    }

    return data;
  },

  async update(id: number, titulo: Partial<TituloBpmn>): Promise<TituloBpmn | null> {
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .update(titulo)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar título BPMN:', error);
      return null;
    }

    return data;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('titulos_bpmn')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar título BPMN:', error);
      return false;
    }

    return true;
  }
};
