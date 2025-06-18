
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useApiTest = (apiUrl: string) => {
  const { toast } = useToast();
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

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

  return {
    isTestingApi,
    apiTestResult,
    testApi
  };
};
