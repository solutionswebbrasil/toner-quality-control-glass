
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ApiSecurityAlert,
  ApiUrlSection,
  ApiKeySection,
  ApiTestButtons,
  ApiTestResult,
  ApiResponseFormat,
  PowerBiInstructions,
  ApiStats,
  useApiTest
} from './apis';

export const ApisIntegracoes: React.FC = () => {
  const { toast } = useToast();
  const [showUrl, setShowUrl] = useState(false);
  
  const apiUrl = 'https://olyozgenxsccrodcfetf.supabase.co/functions/v1/api-retornados';
  const apiKey = 'powerbi-access-2024';
  
  const { isTestingApi, apiTestResult, testApi } = useApiTest(apiUrl);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    }
  };

  const openApiInBrowser = () => {
    window.open(apiUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          APIs de Integrações
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Configure e gerencie APIs para integração com ferramentas externas como Power BI
        </p>
      </div>

      <ApiSecurityAlert />

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>API de Retornados</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Segura</Badge>
            {apiTestResult && (
              <Badge variant={apiTestResult.success ? "default" : "destructive"}>
                {apiTestResult.success ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />Funcionando</>
                ) : (
                  <><XCircle className="h-3 w-3 mr-1" />Com Erro</>
                )}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-description">Descrição</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  API segura que retorna todos os dados de retornados formatados para integração com Power BI. 
                  Inclui informações detalhadas sobre toners, valores recuperados e datas para criação de dashboards.
                </p>
              </div>

              <ApiUrlSection
                apiUrl={apiUrl}
                showUrl={showUrl}
                onToggleShowUrl={() => setShowUrl(!showUrl)}
                onCopyUrl={() => copyToClipboard(apiUrl)}
              />

              <ApiKeySection
                apiKey={apiKey}
                onCopyKey={() => copyToClipboard(apiKey)}
              />

              <ApiTestButtons
                isTestingApi={isTestingApi}
                onTestApi={testApi}
                onOpenInBrowser={openApiInBrowser}
              />

              <ApiTestResult apiTestResult={apiTestResult} />
            </div>

            <div className="space-y-4">
              <ApiResponseFormat />
              <PowerBiInstructions />
            </div>
          </div>

          <ApiStats />
        </CardContent>
      </Card>
    </div>
  );
};
