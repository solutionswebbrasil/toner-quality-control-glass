
import { supabase } from '@/integrations/supabase/client';
import type { RegistroItPop } from '@/types';

export const registroItPopService = {
  getAll: async (): Promise<RegistroItPop[]> => {
    console.log('🔍 Buscando todos os registros IT/POP...');
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar registros IT/POP:', error);
      throw error;
    }
    
    console.log('✅ Registros IT/POP encontrados:', data?.length || 0);
    return (data || []).map(item => ({
      ...item,
      titulo: item.titulos_itpop?.titulo || 'N/A'
    }));
  },

  getByTituloId: async (titulo_id: number): Promise<RegistroItPop[]> => {
    console.log('🔍 Buscando registros IT/POP por título ID:', titulo_id);
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .eq('titulo_id', titulo_id)
      .order('versao', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar registros IT/POP por título:', error);
      throw error;
    }
    
    console.log('✅ Registros encontrados para o título:', data?.length || 0);
    return (data || []).map(item => ({
      ...item,
      titulo: item.titulos_itpop?.titulo || 'N/A'
    }));
  },

  getNextVersion: async (titulo_id: number): Promise<number> => {
    console.log('🔢 Calculando próxima versão para título ID:', titulo_id);
    const { data, error } = await supabase
      .from('registros_itpop')
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

  getById: async (id: number): Promise<RegistroItPop | undefined> => {
    console.log('🔍 Buscando registro IT/POP por ID:', id);
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar registro IT/POP:', error);
      return undefined;
    }
    
    return {
      ...data,
      titulo: data.titulos_itpop?.titulo || 'N/A'
    };
  },

  create: async (registro: Omit<RegistroItPop, 'id' | 'versao'>): Promise<RegistroItPop> => {
    console.log('📝 Criando novo registro IT/POP:', registro);
    
    // Calcular a próxima versão automaticamente
    const nextVersion = await registroItPopService.getNextVersion(registro.titulo_id);
    
    const registroComVersao = {
      ...registro,
      versao: nextVersion,
      // Remover arquivo_ppt do registro
      arquivo_ppt: undefined
    };
    
    console.log('📝 Registro com versão calculada:', registroComVersao);
    
    const { data, error } = await supabase
      .from('registros_itpop')
      .insert([registroComVersao])
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar registro IT/POP:', error);
      throw error;
    }
    
    console.log('✅ Registro IT/POP criado com sucesso:', data);
    return {
      ...data,
      titulo: data.titulos_itpop?.titulo || 'N/A'
    };
  },

  update: async (id: number, registro: Partial<RegistroItPop>): Promise<RegistroItPop | null> => {
    console.log('📝 Atualizando registro IT/POP:', id, registro);
    const { data, error } = await supabase
      .from('registros_itpop')
      .update(registro)
      .eq('id', id)
      .select(`
        *,
        titulos_itpop:titulo_id (
          titulo
        )
      `)
      .single();
    
    if (error) {
      console.error('❌ Erro ao atualizar registro IT/POP:', error);
      return null;
    }
    
    return {
      ...data,
      titulo: data.titulos_itpop?.titulo || 'N/A'
    };
  },

  delete: async (id: number): Promise<boolean> => {
    console.log('🗑️ Deletando registro IT/POP:', id);
    const { error } = await supabase
      .from('registros_itpop')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao deletar registro IT/POP:', error);
      return false;
    }
    
    console.log('✅ Registro IT/POP deletado');
    return true;
  }
};
