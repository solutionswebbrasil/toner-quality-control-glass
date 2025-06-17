
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ApisIntegracoes: React.FC = () => {
  const { toast } = useToast();
  const [showUrl, setShowUrl] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  
  const apiUrl = 'https://olyozgenxsccrodcfetf.supabase.co/functions/v1/api-retornados';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "URL da API copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL.",
        variant: "destructive"
      });
    }
  };

  const testApi = async () => {
    setIsTestingApi(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "API Funcionando!",
          description: `API retornou ${data.total_registros} registros com sucesso.`,
        });
      } else {
        throw new Error(data.message || 'Erro na resposta da API');
      }
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: "A API não está respondendo corretamente.",
        variant: "destructive"
      });
    } finally {
      setIsTestingApi(false);
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

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>API de Retornados</span>
            <Badge variant="secondary">Público</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-description">Descrição</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  API pública que retorna todos os dados de retornados formatados para integração com Power BI. 
                  Inclui informações detalhadas sobre toners, valores recuperados e datas para criação de dashboards.
                </p>
              </div>

              <div>
                <Label htmlFor="api-url">URL da API</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="api-url"
                    value={showUrl ? apiUrl : '••••••••••••••••••••••••••••••••'}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowUrl(!showUrl)}
                    title={showUrl ? "Ocultar URL" : "Mostrar URL"}
                  >
                    {showUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(apiUrl)}
                    title="Copiar URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={testApi}
                  disabled={isTestingApi}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isTestingApi ? 'animate-spin' : ''}`} />
                  {isTestingApi ? 'Testando...' : 'Testar API'}
                </Button>
                <Button
                  variant="outline"
                  onClick={openApiInBrowser}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir no Navegador
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Formato de Resposta</Label>
                <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <pre className="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
{`{
  "success": true,
  "total_registros": 1000,
  "data_atualizacao": "2024-01-01T00:00:00Z",
  "dados": [
    {
      "id": 1,
      "id_cliente": 12345,
      "modelo_toner": "CF410A",
      "cor_toner": "Preto",
      "filial": "Matriz",
      "destino_final": "Estoque",
      "valor_recuperado": 45.50,
      "data_registro": "2024-01-01",
      "ano": 2024,
      "mes": 1,
      "mes_nome": "janeiro",
      "trimestre": 1
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              <div>
                <Label>Instruções para Power BI</Label>
                <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <ol className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                    <li>1. Abra o Power BI Desktop</li>
                    <li>2. Vá em "Obter Dados" → "Web"</li>
                    <li>3. Cole a URL da API acima</li>
                    <li>4. Clique em "OK" e configure os dados</li>
                    <li>5. Use os campos para criar seus dashboards</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">Público</div>
                <div className="text-sm text-green-700 dark:text-green-300">Sem autenticação</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">JSON</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Formato de resposta</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Tempo Real</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Dados atualizados</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
