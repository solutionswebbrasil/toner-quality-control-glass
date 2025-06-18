
import { supabase } from '@/integrations/supabase/client';
import type { Toner } from '@/types';
import { auditLogger } from '@/utils/auditLogger';

export const tonerService = {
  getAll: async (): Promise<Toner[]> => {
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

  create: async (toner: Omit<Toner, 'id' | 'data_registro' | 'user_id'>): Promise<Toner> => {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const tonerWithUser = {
      ...toner,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('toners')
      .insert([tonerWithUser])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar toner:', error);
      throw error;
    }
    
    // Log audit
    await auditLogger.logCreate('toners', data.id.toString(), data);
    
    return data;
  },

  update: async (id: number, toner: Omit<Partial<Toner>, 'user_id'>): Promise<Toner | null> => {
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
    
    // Log audit
    await auditLogger.logUpdate('toners', id.toString(), {}, data);
    
    return data;
  },

  delete: async (id: number): Promise<boolean> => {
    // Get record before deletion for audit
    const { data: oldRecord } = await supabase
      .from('toners')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('toners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar toner:', error);
      return false;
    }
    
    // Log audit
    if (oldRecord) {
      await auditLogger.logDelete('toners', id.toString(), oldRecord);
    }
    
    return true;
  }
};
