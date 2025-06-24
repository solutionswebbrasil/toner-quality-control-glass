
import { useState } from 'react';

interface ApiTestResult {
  success: boolean;
  data?: any;
  error?: string;
  responseTime?: number;
  status?: number;
}

export const useApiTest = (apiUrl?: string) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ApiTestResult>>({});
  const [apiTestResult, setApiTestResult] = useState<ApiTestResult | null>(null);

  const testEndpoint = async (name: string, url: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const result = {
        success: true,
        data,
        responseTime,
        status: response.status,
      };
      
      setResults(prev => ({
        ...prev,
        [name]: result
      }));

      if (name === 'API Test' || url === apiUrl) {
        setApiTestResult(result);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      const result = {
        success: false,
        error: errorMessage,
        responseTime,
      };
      
      setResults(prev => ({
        ...prev,
        [name]: result
      }));

      if (name === 'API Test' || url === apiUrl) {
        setApiTestResult(result);
      }
    } finally {
      setLoading(false);
    }
  };

  const testApi = () => {
    if (apiUrl) {
      testEndpoint('API Test', apiUrl);
    }
  };

  const testAllEndpoints = async () => {
    const endpoints = [
      { name: 'Dashboard Data', url: '/api/dashboard' },
      { name: 'Toners', url: '/api/toners' },
      { name: 'Retornados', url: '/api/retornados' },
      { name: 'Garantias', url: '/api/garantias' },
      { name: 'Auditorias', url: '/api/auditorias' },
    ];

    for (const endpoint of endpoints) {
      await testEndpoint(endpoint.name, endpoint.url);
    }
  };

  const clearResults = () => {
    setResults({});
    setApiTestResult(null);
  };

  return {
    loading,
    results,
    testEndpoint,
    testAllEndpoints,
    clearResults,
    isTestingApi: loading,
    apiTestResult,
    testApi,
  };
};
