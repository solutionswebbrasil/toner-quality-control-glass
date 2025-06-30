
import { supabase } from '@/integrations/supabase/client';
import type { Fornecedor } from '@/types';

export const fornecedorService = {
  getAll: async (): Promise<Fornecedor[]> => {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar fornecedores:', error);
      throw error;
    }
    
    return data || [];
  },

  getById: async (id: number): Promise<Fornecedor | undefined> => {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar fornecedor:', error);
      return undefined;
    }
    
    return data;
  },

  create: async (fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> => {
    const { data, error } = await supabase
      .from('fornecedores')
      .insert([fornecedor])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar fornecedor:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor | null> => {
    const { data, error } = await supabase
      .from('fornecedores')
      .update(fornecedor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      return null;
    }
    
    return data;
  },

  delete: async (id: number): Promise<{ success: boolean; message?: string }> => {
    // Primeiro, verificar se existem garantias vinculadas a este fornecedor
    const { data: garantias, error: garantiasError } = await supabase
      .from('garantias')
      .select('id')
      .eq('fornecedor_id', id)
      .limit(1);
    
    if (garantiasError) {
      console.error('Erro ao verificar garantias vinculadas:', garantiasError);
      return { success: false, message: 'Erro ao verificar vínculos com garantias.' };
    }
    
    // Se existem garantias vinculadas, não permitir exclusão
    if (garantias && garantias.length > 0) {
      return { 
        success: false, 
        message: 'Não foi possível excluir o fornecedor pois existem garantias vinculadas a ele. Remova as garantias primeiro.' 
      };
    }
    
    // Se não há garantias vinculadas, prosseguir com a exclusão
    const { error } = await supabase
      .from('fornecedores')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar fornecedor:', error);
      return { success: false, message: 'Erro ao excluir fornecedor.' };
    }
    
    return { success: true };
  }
};
