import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create axios instance with auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  // Claude AI
  chat: async (message: string, history: ChatMessage[] = []) => {
    const response = await apiClient.post('/api/claude/chat', {
      message,
      conversationHistory: history
    });
    return response.data;
  },

  analyzeSupplier: async (supplierData: any) => {
    const response = await apiClient.post('/api/claude/analyze-supplier', {
      supplierData
    });
    return response.data;
  },

  generateReport: async (reportType: string = 'executive') => {
    const response = await apiClient.post('/api/claude/generate-report', {
      reportType
    });
    return response.data;
  },

  // Suppliers
  getSuppliers: async () => {
    const response = await apiClient.get('/api/suppliers');
    return response.data;
  },

  // Agents
  listAgents: async () => {
    const response = await apiClient.get('/api/agents');
    return response.data;
  },

  runAgent: async (agentName: string, data: any) => {
    const response = await apiClient.post(`/api/agents/${agentName}`, data);
    return response.data;
  },

  // Health check (public)
  healthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
};
