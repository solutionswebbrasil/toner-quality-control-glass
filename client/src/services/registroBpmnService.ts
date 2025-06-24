
import { supabase } from '@/integrations/supabase/client';
import type { RegistroBpmn, TituloBpmn } from '@/types';

export const registroBpmnService = {
  async getAll(): Promise<RegistroBpmn[]> {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select(`
        *,
        titulo:titulos_bpmn(id, titulo, descricao)
      `)
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar registros BPMN: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      titulo_id: item.titulo_id,
      versao: item.versao,
      arquivo_png: item.arquivo_png,
      data_registro: item.data_registro,
      registrado_por: item.registrado_por,
      titulo: item.titulo
    }));
  },

  async getAllByTitulo(tituloId: number): Promise<RegistroBpmn[]> {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select(`
        *,
        titulo:titulos_bpmn(id, titulo, descricao)
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
      arquivo_png: item.arquivo_png,
      data_registro: item.data_registro,
      registrado_por: item.registrado_por,
      titulo: item.titulo
    }));
  },

  async getById(id: number): Promise<RegistroBpmn | null> {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .select(`
        *,
        titulo:titulos_bpmn(id, titulo, descricao)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar registro BPMN:', error);
      return null;
    }

    return {
      id: data.id,
      titulo_id: data.titulo_id,
      versao: data.versao,
      arquivo_png: data.arquivo_png,
      data_registro: data.data_registro,
      registrado_por: data.registrado_por,
      titulo: data.titulo
    };
  },

  async create(registro: Omit<RegistroBpmn, 'id' | 'versao' | 'titulo'>): Promise<RegistroBpmn> {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .insert([registro])
      .select(`
        *,
        titulo:titulos_bpmn(id, titulo, descricao)
      `)
      .single();

    if (error) {
      throw new Error(`Erro ao criar registro BPMN: ${error.message}`);
    }

    return {
      id: data.id,
      titulo_id: data.titulo_id,
      versao: data.versao,
      arquivo_png: data.arquivo_png,
      data_registro: data.data_registro,
      registrado_por: data.registrado_por,
      titulo: data.titulo
    };
  },

  async update(id: number, registro: Partial<RegistroBpmn>): Promise<RegistroBpmn | null> {
    const { data, error } = await supabase
      .from('registros_bpmn')
      .update(registro)
      .eq('id', id)
      .select(`
        *,
        titulo:titulos_bpmn(id, titulo, descricao)
      `)
      .single();

    if (error) {
      console.error('Erro ao atualizar registro BPMN:', error);
      return null;
    }

    return {
      id: data.id,
      titulo_id: data.titulo_id,
      versao: data.versao,
      arquivo_png: data.arquivo_png,
      data_registro: data.data_registro,
      registrado_por: data.registrado_por,
      titulo: data.titulo
    };
  },

  async delete(id: number): Promise<boolean> {
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
