
import { supabase } from '@/integrations/supabase/client';
import type { TituloItPop } from '@/types';

export const tituloItPopService = {
  getAll: async (): Promise<TituloItPop[]> => {
    console.log('🔍 Buscando todos os títulos IT/POP...');
    const { data, error } = await supabase
      .from('titulos_itpop')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar títulos IT/POP:', error);
      throw error;
    }
    
    console.log('✅ Títulos IT/POP encontrados:', data?.length || 0);
    return data || [];
  },

  getById: async (id: number): Promise<TituloItPop | undefined> => {
    console.log('🔍 Buscando título IT/POP por ID:', id);
    const { data, error } = await supabase
      .from('titulos_itpop')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar título IT/POP:', error);
      return undefined;
    }
    
    console.log('✅ Título IT/POP encontrado:', data);
    return data;
  },

  create: async (titulo: Omit<TituloItPop, 'id'>): Promise<TituloItPop> => {
    console.log('📝 Criando novo título IT/POP:', titulo);
    const { data, error } = await supabase
      .from('titulos_itpop')
      .insert([titulo])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar título IT/POP:', error);
      throw error;
    }
    
    console.log('✅ Título IT/POP criado com sucesso:', data);
    return data;
  },

  update: async (id: number, titulo: Partial<TituloItPop>): Promise<TituloItPop | null> => {
    console.log('📝 Atualizando título IT/POP:', id, titulo);
    const { data, error } = await supabase
      .from('titulos_itpop')
      .update(titulo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar título IT/POP:', error);
      return null;
    }
    
    console.log('✅ Título IT/POP atualizado:', data);
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando título IT/POP:', id);
    const { error } = await supabase
      .from('titulos_itpop')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar título IT/POP:', error);
      return false;
    }
    
    console.log('✅ Título IT/POP deletado');
    return true;
  }
};
