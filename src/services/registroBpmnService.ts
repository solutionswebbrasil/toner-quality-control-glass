
import { supabase } from '@/integrations/supabase/client';
import type { RegistroBpmn } from '@/types';

export const registroBpmnService = {
  getAll: async (): Promise<RegistroBpmn[]> => {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar registros BPMN:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      titulo: item.titulos_bpmn?.titulo || 'N/A'
    }));
  },

  getById: async (id: number): Promise<RegistroBpmn | undefined> => {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar registro BPMN:', error);
      return undefined;
    }
    
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A'
    };
  },

  create: async (registro: Omit<RegistroBpmn, 'id'>): Promise<RegistroBpmn> => {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .insert([registro])
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao criar registro BPMN:', error);
      throw error;
    }
    
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A'
    };
  },

  update: async (id: number, registro: Partial<RegistroBpmn>): Promise<RegistroBpmn | null> => {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .update(registro)
      .eq('id', id)
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao atualizar registro BPMN:', error);
      return null;
    }
    
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A'
    };
  },

  delete: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('registros_bpmn')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar registro BPMN:', error);
      return false;
    }
    
    return true;
  }
};
