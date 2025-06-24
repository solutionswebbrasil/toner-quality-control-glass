
import { supabase } from '@/integrations/supabase/client';
import type { RegistroItPop, TituloItPop } from '@/types';

export const registroItPopService = {
  async getAll(): Promise<RegistroItPop[]> {
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulo:titulos_itpop(id, titulo, descricao)
      `)
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar registros IT/POP: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      titulo_id: item.titulo_id,
      versao: item.versao,
      arquivo_pdf: item.arquivo_pdf,
      arquivo_ppt: item.arquivo_ppt,
      data_registro: item.data_registro,
      registrado_por: item.registrado_por,
      titulo: item.titulo
    }));
  },

  async getAllByTitulo(tituloId: number): Promise<RegistroItPop[]> {
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulo:titulos_itpop(id, titulo, descricao)
      `)
      .eq('titulo_id', tituloId)
      .order('versao', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar registros por título: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      titulo_id: item.titulo_id,
      versao: item.versao,
      arquivo_pdf: item.arquivo_pdf,
      arquivo_ppt: item.arquivo_ppt,
      data_registro: item.data_registro,
      registrado_por: item.registrado_por,
      titulo: item.titulo
    }));
  },

  async getById(id: number): Promise<RegistroItPop | null> {
    const { data, error } = await supabase
      .from('registros_itpop')
      .select(`
        *,
        titulo:titulos_itpop(id, titulo, descricao)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar registro IT/POP:', error);
      return null;
    }

    return {
      id: data.id,
      titulo_id: data.titulo_id,
      versao: data.versao,
      arquivo_pdf: data.arquivo_pdf,
      arquivo_ppt: data.arquivo_ppt,
      data_registro: data.data_registro,
      registrado_por: data.registrado_por,
      titulo: data.titulo
    };
  },

  async create(registro: Omit<RegistroItPop, 'id' | 'versao' | 'titulo'>): Promise<RegistroItPop> {
    // Primeiro, buscar a próxima versão
    const { data: existingRecords } = await supabase
      .from('registros_itpop')
      .select('versao')
      .eq('titulo_id', registro.titulo_id)
      .order('versao', { ascending: false })
      .limit(1);

    const nextVersion = existingRecords && existingRecords.length > 0 
      ? existingRecords[0].versao + 1 
      : 1;

    const registroData = {
      ...registro,
      versao: nextVersion
    };

    const { data, error } = await supabase
      .from('registros_itpop')
      .insert([registroData])
      .select(`
        *,
        titulo:titulos_itpop(id, titulo, descricao)
      `)
      .single();

    if (error) {
      throw new Error(`Erro ao criar registro IT/POP: ${error.message}`);
    }

    return {
      id: data.id,
      titulo_id: data.titulo_id,
      versao: data.versao,
      arquivo_pdf: data.arquivo_pdf,
      arquivo_ppt: data.arquivo_ppt,
      data_registro: data.data_registro,
      registrado_por: data.registrado_por,
      titulo: data.titulo
    };
  },

  async update(id: number, registro: Partial<RegistroItPop>): Promise<RegistroItPop | null> {
    const { data, error } = await supabase
      .from('registros_itpop')
      .update(registro)
      .eq('id', id)
      .select(`
        *,
        titulo:titulos_itpop(id, titulo, descricao)
      `)
      .single();

    if (error) {
      console.error('Erro ao atualizar registro IT/POP:', error);
      return null;
    }

    return {
      id: data.id,
      titulo_id: data.titulo_id,
      versao: data.versao,
      arquivo_pdf: data.arquivo_pdf,
      arquivo_ppt: data.arquivo_ppt,
      data_registro: data.data_registro,
      registrado_por: data.registrado_por,
      titulo: data.titulo
    };
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('registros_itpop')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar registro IT/POP:', error);
      return false;
    }

    return true;
  }
};
