

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
      titulo: item.titulos_bpmn?.titulo || 'N/A'
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
      titulo: item.titulos_bpmn?.titulo || 'N/A'
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
      titulo: data.titulos_bpmn?.titulo || 'N/A'
    };
  },

  create: async (registro: Omit<RegistroBpmn, 'id' | 'versao'>): Promise<RegistroBpmn> => {
    console.log('📝 Criando novo registro BPMN:', registro);
    
    // Garantir que apenas campos válidos sejam enviados
    const registroLimpo = {
      titulo_id: registro.titulo_id,
      arquivo_png: registro.arquivo_png,
      data_registro: registro.data_registro,
      registrado_por: registro.registrado_por
    };
    
    console.log('📝 Registro BPMN a ser criado:', registroLimpo);
    
    const { data, error } = await supabase
      .from('registros_bpmn')
      .insert([registroLimpo])
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
      titulo: data.titulos_bpmn?.titulo || 'N/A'
    };
  },

  update: async (id: number, registro: Partial<RegistroBpmn>): Promise<RegistroBpmn | null> => {
    console.log('📝 Atualizando registro BPMN:', id, registro);
    
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
      console.error('❌ Erro ao atualizar registro BPMN:', error);
      return null;
    }
    
    return {
      ...data,
      titulo: data.titulos_bpmn?.titulo || 'N/A'
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
