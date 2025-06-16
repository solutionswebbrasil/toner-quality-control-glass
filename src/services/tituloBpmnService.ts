
import { supabase } from '@/integrations/supabase/client';
import type { TituloBpmn } from '@/types';

export const tituloBpmnService = {
  getAll: async (): Promise<TituloBpmn[]> => {
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar títulos BPMN:', error);
      throw error;
    }
    
    return data || [];
  },

  getById: async (id: number): Promise<TituloBpmn | undefined> => {
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar título BPMN:', error);
      return undefined;
    }
    
    return data;
  },

  create: async (titulo: Omit<TituloBpmn, 'id'>): Promise<TituloBpmn> => {
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .insert([titulo])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar título BPMN:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, titulo: Partial<TituloBpmn>): Promise<TituloBpmn | null> => {
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

  delete: async (id: number): Promise<boolean> => {
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
