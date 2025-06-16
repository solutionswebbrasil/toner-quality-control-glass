
import { supabase } from '@/integrations/supabase/client';

export const fileUploadService = {
  uploadPdf: async (file: File, folder: string): Promise<string | null> => {
    try {
      console.log('📤 Iniciando upload do arquivo PDF:', file.name, 'para pasta:', folder);
      
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Erro no upload:', error);
        throw error;
      }

      console.log('✅ Upload realizado com sucesso:', data);

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      console.log('🔗 URL pública gerada:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Erro no upload de arquivo:', error);
      throw error; // Re-throw para que o erro seja tratado no componente
    }
  },

  uploadImage: async (file: File, folder: string): Promise<string | null> => {
    try {
      console.log('📤 Iniciando upload da imagem:', file.name, 'para pasta:', folder);
      
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Erro no upload da imagem:', error);
        throw error;
      }

      console.log('✅ Upload da imagem realizado com sucesso:', data);

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      console.log('🔗 URL pública da imagem gerada:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Erro no upload da imagem:', error);
      throw error;
    }
  },

  uploadFile: async (file: File, folder: string): Promise<string | null> => {
    try {
      console.log('📤 Iniciando upload do arquivo:', file.name, 'para pasta:', folder);
      
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Erro no upload do arquivo:', error);
        throw error;
      }

      console.log('✅ Upload do arquivo realizado com sucesso:', data);

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      console.log('🔗 URL pública do arquivo gerada:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Erro no upload do arquivo:', error);
      throw error;
    }
  },

  deletePdf: async (fileUrl: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deletando arquivo:', fileUrl);
      
      // Extrair o caminho do arquivo da URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;
      
      console.log('📍 Caminho do arquivo:', filePath);
      
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (error) {
        console.error('❌ Erro ao deletar arquivo:', error);
        return false;
      }

      console.log('✅ Arquivo deletado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo:', error);
      return false;
    }
  }
};
