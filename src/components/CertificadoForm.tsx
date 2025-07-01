
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CertificadoFormProps {
  onSuccess?: () => void;
}

interface CertificadoData {
  nome_certificado: string;
  data_emissao: string;
  arquivo_pdf?: string;
}

export const CertificadoForm: React.FC<CertificadoFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CertificadoData>();

  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!file) return null;

    setUploadingFile(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fileName = `certificado_${Date.now()}_${file.name}`;
      console.log('Arquivo simulado uploaded:', fileName);
      return fileName;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do arquivo PDF.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const onSubmit = async (data: CertificadoData) => {
    setLoading(true);
    try {
      let arquivoPdf = data.arquivo_pdf;

      // Upload do arquivo PDF se foi selecionado
      const fileInput = document.getElementById('arquivo_pdf') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        const uploadedPath = await handleFileUpload(fileInput.files[0]);
        if (uploadedPath) {
          arquivoPdf = uploadedPath;
        }
      }

      const certificadoData = {
        ...data,
        arquivo_pdf: arquivoPdf
      };

      console.log('Registrando certificado (frontend only):', certificadoData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sucesso",
        description: "Certificado registrado com sucesso!",
      });
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao registrar certificado:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar certificado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Registro de Certificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="nome_certificado">Nome do Certificado *</Label>
              <Input
                id="nome_certificado"
                {...register('nome_certificado', { required: 'Campo obrigatório' })}
                placeholder="Ex: ISO 9001, ISO 14001..."
              />
              {errors.nome_certificado && (
                <p className="text-red-500 text-sm mt-1">{errors.nome_certificado.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="data_emissao">Data de Emissão *</Label>
              <Input
                id="data_emissao"
                type="date"
                {...register('data_emissao', { required: 'Campo obrigatório' })}
              />
              {errors.data_emissao && (
                <p className="text-red-500 text-sm mt-1">{errors.data_emissao.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="arquivo_pdf">Arquivo PDF</Label>
              <Input
                id="arquivo_pdf"
                type="file"
                accept=".pdf"
                disabled={uploadingFile}
              />
              {uploadingFile && (
                <p className="text-blue-500 text-sm mt-1">Fazendo upload do arquivo...</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
              >
                Limpar
              </Button>
              <Button type="submit" disabled={loading || uploadingFile}>
                {loading ? 'Salvando...' : 'Registrar Certificado'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
