
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Eye, EyeOff, RefreshCw, Shield, Clock, Key, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ApisIntegracoes: React.FC = () => {
  const { toast } = useToast();
  const [showUrl, setShowUrl] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  
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
    setApiTestResult(null);
    
    try {
      console.log('Testando API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': 'powerbi-access-2024',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      setApiTestResult({
        success: true,
        status: response.status,
        data: data
      });
      
      if (data.success) {
        toast({
          title: "API Funcionando!",
          description: `API retornou ${data.total_registros} registros com sucesso.`,
        });
      } else {
        throw new Error(data.message || 'Erro na resposta da API');
      }
    } catch (error) {
      console.error('Erro no teste da API:', error);
      
      setApiTestResult({
        success: false,
        error: error.message,
        status: null
      });
      
      toast({
        title: "Erro no Teste",
        description: `Erro: ${error.message}`,
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

      {/* Security Notice */}
      <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Segurança Implementada:</strong> Esta API agora inclui autenticação por chave, rate limiting (100 req/15min) e logs de auditoria para garantir segurança e monitoramento de acesso.
        </AlertDescription>
      </Alert>

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

              <div>
                <Label htmlFor="api-key">Chave de API (Opcional)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="api-key"
                    value="powerbi-access-2024"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard('powerbi-access-2024')}
                    title="Copiar Chave"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Adicione como header: X-API-Key para acesso autenticado
                </p>
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

              {/* Resultado do Teste */}
              {apiTestResult && (
                <div className="mt-4">
                  <Label>Resultado do Teste</Label>
                  <div className={`mt-1 p-3 rounded-md border ${
                    apiTestResult.success 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {apiTestResult.success ? (
                      <div>
                        <p className="font-semibold">✅ Teste bem-sucedido!</p>
                        <p className="text-sm">Status HTTP: {apiTestResult.status}</p>
                        <p className="text-sm">Total de registros: {apiTestResult.data?.total_registros || 0}</p>
                        <p className="text-sm">Última atualização: {apiTestResult.data?.data_atualizacao ? new Date(apiTestResult.data.data_atualizacao).toLocaleString('pt-BR') : 'N/A'}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">❌ Erro no teste</p>
                        <p className="text-sm">{apiTestResult.error}</p>
                        {apiTestResult.status && <p className="text-sm">Status HTTP: {apiTestResult.status}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
      "trimestre": 1,
      "peso": 1.2,
      "peso_vazio": 0.8,
      "gramatura": 85.5,
      "capacidade_folhas": 2300,
      "valor_por_folha": 0.02
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
                    <li>4. Em "Opções Avançadas", adicione header:</li>
                    <li className="ml-4">• Nome: X-API-Key</li>
                    <li className="ml-4">• Valor: powerbi-access-2024</li>
                    <li>5. Clique em "OK" e configure os dados</li>
                    <li>6. Use os campos para criar seus dashboards</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <Shield className="h-5 w-5" />
                  Segura
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Com autenticação</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">JSON</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Formato de resposta</div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  Completa
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Todos os dados</div>
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
