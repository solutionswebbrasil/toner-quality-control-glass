import { supabase } from '@/integrations/supabase/client';
import type { RegistroBpmn } from '@/types';

export const registroBpmnService = {
  getAll: async (): Promise<RegistroBpmn[]> => {
    console.log('🔍 Buscando todos os registros BPMN...');
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
      console.error('❌ Erro ao buscar registros BPMN:', error);
      throw error;
    }
    
    console.log('✅ Registros BPMN encontrados:', data?.length || 0);
    return (data || []).map(item => ({
      ...item,
      titulo: item.titulos_bpmn?.titulo || 'N/A',
      // Map arquivo_bizagi to arquivo_zip for backward compatibility
      arquivo_zip: item.arquivo_bizagi || undefined
    }));
  },

  getByTituloId: async (titulo_id: number): Promise<RegistroBpmn[]> => {
    console.log('🔍 Buscando registros BPMN por título ID:', titulo_id);
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .eq('titulo_id', titulo_id)
      .order('versao', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar registros BPMN por título:', error);
      throw error;
    }
    
    console.log('✅ Registros encontrados para o título:', data?.length || 0);
    return (data || []).map(item => ({
      ...item,
      titulo: item.titulos_bpmn?.titulo || 'N/A',
      // Map arquivo_bizagi to arquivo_zip for backward compatibility
      arquivo_zip: item.arquivo_bizagi || undefined
    }));
  },

  getNextVersion: async (titulo_id: number): Promise<number> => {
    console.log('🔢 Calculando próxima versão para título ID:', titulo_id);
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select('versao')
      .eq('titulo_id', titulo_id)
      .order('versao', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao buscar versão:', error);
      return 1;
    }
    
    const nextVersion = data && data.length > 0 ? data[0].versao + 1 : 1;
    console.log('✅ Próxima versão calculada:', nextVersion);
    return nextVersion;
  },

  getById: async (id: number): Promise<RegistroBpmn | undefined> => {
    console.log('🔍 Buscando registro BPMN por ID:', id);
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
      console.error('❌ Erro ao buscar registro BPMN:', error);
      return undefined;
    }
    
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A',
      // Map arquivo_bizagi to arquivo_zip for backward compatibility
      arquivo_zip: data.arquivo_bizagi || undefined
    };
  },

  create: async (registro: Omit<RegistroBpmn, 'id' | 'versao'>): Promise<RegistroBpmn> => {
    console.log('📝 Criando novo registro BPMN:', registro);
    
    // Map arquivo_zip to arquivo_bizagi for database storage
    const registroParaBanco = {
      ...registro,
      arquivo_bizagi: registro.arquivo_zip,
      arquivo_zip: undefined
    };
    
    console.log('📝 Registro BPMN a ser criado:', registroParaBanco);
    
    const { data, error } = await supabase
      .from('registros_bpmn')
      .insert([registroParaBanco])
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar registro BPMN:', error);
      throw error;
    }
    
    console.log('✅ Registro BPMN criado com sucesso:', data);
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A',
      // Map arquivo_bizagi to arquivo_zip for response
      arquivo_zip: data.arquivo_bizagi || undefined
    };
  },

  update: async (id: number, registro: Partial<RegistroBpmn>): Promise<RegistroBpmn | null> => {
    console.log('📝 Atualizando registro BPMN:', id, registro);
    
    // Map arquivo_zip to arquivo_bizagi for database storage
    const registroParaBanco = {
      ...registro,
      arquivo_bizagi: registro.arquivo_zip,
      arquivo_zip: undefined
    };
    
    const { data, error } = await supabase
      .from('registros_bpmn')
      .update(registroParaBanco)
      .eq('id', id)
      .select(`
        *,
        titulos_bpmn:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar registro BPMN:', error);
      return null;
    }
    
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A',
      // Map arquivo_bizagi to arquivo_zip for response
      arquivo_zip: data.arquivo_bizagi || undefined
    };
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando registro BPMN:', id);
    const { error } = await supabase
      .from('registros_bpmn')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar registro BPMN:', error);
      return false;
    }
    
    console.log('✅ Registro BPMN deletado');
    return true;
  }
};
