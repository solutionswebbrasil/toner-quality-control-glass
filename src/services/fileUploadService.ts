
import { supabase } from '@/integrations/supabase/client';

export const fileUploadService = {
  uploadPdf: async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('garantia-pdfs')
        .upload(filePath, file);

      if (error) {
        console.error('Erro no upload:', error);
        return null;
      }

      // Retorna a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('garantia-pdfs')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      return null;
    }
  },

  deletePdf: async (url: string): Promise<boolean> => {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = url.split('/storage/v1/object/public/garantia-pdfs/');
      if (urlParts.length !== 2) return false;

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from('garantia-pdfs')
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }
};
