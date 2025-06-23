

import type { TituloBpmn } from '@/types';

export const tituloBpmnService = {
  getAll: async (): Promise<TituloBpmn[]> => {
    console.log('🔍 Buscando todos os títulos BPMN...');
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar títulos BPMN:', error);
      throw error;
    }
    
    console.log('✅ Títulos BPMN encontrados:', data?.length || 0);
    return data || [];
  },

  getById: async (id: number): Promise<TituloBpmn | undefined> => {
    console.log('🔍 Buscando título BPMN por ID:', id);
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar título BPMN:', error);
      return undefined;
    }
    
    console.log('✅ Título BPMN encontrado:', data);
    return data;
  },

  create: async (titulo: Omit<TituloBpmn, 'id'>): Promise<TituloBpmn> => {
    console.log('📝 Criando novo título BPMN:', titulo);
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .insert([titulo])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar título BPMN:', error);
      throw error;
    }
    
    console.log('✅ Título BPMN criado com sucesso:', data);
    return data;
  },

  update: async (id: number, titulo: Partial<TituloBpmn>): Promise<TituloBpmn | null> => {
    console.log('📝 Atualizando título BPMN:', id, titulo);
    const { data, error } = await supabase
      .from('titulos_bpmn')
      .update(titulo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar título BPMN:', error);
      return null;
    }
    
    console.log('✅ Título BPMN atualizado:', data);
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando título BPMN:', id);
    const { error } = await supabase
      .from('titulos_bpmn')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar título BPMN:', error);
      return false;
    }
    
    console.log('✅ Título BPMN deletado');
    return true;
  }
};
