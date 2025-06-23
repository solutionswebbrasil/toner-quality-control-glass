// API client to replace Supabase client calls
const API_BASE = '/api';

// Authentication
export const authApi = {
  login: async (usuario: string, senha: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },
};

// Generic API functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Import mock data for demonstration
import { generateMockData } from './mockData';

const mockData = generateMockData();

// Data APIs with mock data fallback
export const fornecedoresApi = {
  getAll: () => apiRequest('/fornecedores'),
  create: (data: any) => apiRequest('/fornecedores', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/fornecedores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/fornecedores/${id}`, {
    method: 'DELETE',
  }),
};

export const tonersApi = {
  getAll: () => apiRequest('/toners'),
  create: (data: any) => apiRequest('/toners', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/toners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/toners/${id}`, {
    method: 'DELETE',
  }),
};

export const retornadosApi = {
  getAll: () => apiRequest('/retornados'),
  create: (data: any) => apiRequest('/retornados', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/retornados/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/retornados/${id}`, {
    method: 'DELETE',
  }),
  getPowerBiData: () => apiRequest('/retornados-powerbi'),
};

export const garantiasApi = {
  getAll: () => apiRequest('/garantias'),
  create: (data: any) => apiRequest('/garantias', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/garantias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/garantias/${id}`, {
    method: 'DELETE',
  }),
};

export const filiaisApi = {
  getAll: () => Promise.resolve(mockData.filiais),
  create: (data: any) => apiRequest('/filiais', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const certificadosApi = {
  getAll: () => Promise.resolve(mockData.certificados),
  create: (data: any) => apiRequest('/certificados', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const auditoriasApi = {
  getAll: () => Promise.resolve(mockData.auditorias),
  create: (data: any) => apiRequest('/auditorias', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const naoConformidadesApi = {
  getAll: () => apiRequest('/nao-conformidades'),
  create: (data: any) => apiRequest('/nao-conformidades', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const itPopApi = {
  getTitulos: () => apiRequest('/titulos-itpop'),
  getRegistros: () => apiRequest('/registros-itpop'),
};

export const bpmnApi = {
  getTitulos: () => apiRequest('/titulos-bpmn'),
  getRegistros: () => apiRequest('/registros-bpmn'),
};