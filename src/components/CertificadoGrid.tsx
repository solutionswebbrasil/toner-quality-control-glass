
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, FileText } from 'lucide-react';
import { useCertificados } from '@/hooks/useCertificados';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const CertificadoGrid: React.FC = () => {
  const { certificados, loading, deleteCertificado } = useCertificados();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando certificados...</div>
      </div>
    );
  }

  if (certificados.length === 0) {
    return (
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhum certificado encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Registre o primeiro certificado para começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = (arquivo_pdf: string | undefined, nome_certificado: string) => {
    if (arquivo_pdf) {
      const link = document.createElement('a');
      link.href = arquivo_pdf;
      link.download = `${nome_certificado}.pdf`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Consulta de Certificados
        </h2>
        <Badge variant="secondary" className="text-sm">
          {certificados.length} certificado(s) encontrado(s)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificados.map((certificado) => (
          <Card
            key={certificado.id}
            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                {certificado.nome_certificado}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Data de Emissão:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {format(new Date(certificado.data_emissao), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Registrado em:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {certificado.data_registro && format(new Date(certificado.data_registro), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Arquivo PDF:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {certificado.arquivo_pdf ? 'Disponível' : 'Não enviado'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2">
                  {certificado.arquivo_pdf && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(certificado.arquivo_pdf, certificado.nome_certificado)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o certificado "{certificado.nome_certificado}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => certificado.id && deleteCertificado(certificado.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
