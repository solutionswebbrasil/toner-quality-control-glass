
import { useState } from 'react';

interface ApiTestResult {
  success: boolean;
  data?: any;
  error?: string;
  responseTime?: number;
}

export const useApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ApiTestResult>>({});

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
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          data,
          responseTime,
        }
      }));
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: errorMessage,
          responseTime,
        }
      }));
    } finally {
      setLoading(false);
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
  };

  return {
    loading,
    results,
    testEndpoint,
    testAllEndpoints,
    clearResults,
  };
};
