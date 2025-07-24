import axios, { AxiosResponse } from 'axios';
import {
  EmbeddingResponse,
  SearchResponse,
  ChatResponse,
  ChatRequest,
  Conversation,
  HealthResponse
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://journey-ai-webservice.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Health check
  static async getHealth(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> = await apiClient.get('/health');
    return response.data;
  }

  // Embedding operations
  static async createEmbedding(data: any): Promise<EmbeddingResponse> {
    const response: AxiosResponse<EmbeddingResponse> = await apiClient.post('/api/v1/embed', data);
    return response.data;
  }

  static async processExample(): Promise<EmbeddingResponse> {
    const response: AxiosResponse<EmbeddingResponse> = await apiClient.post('/api/v1/example');
    return response.data;
  }

  // Search operations
  static async searchDocuments(
    query: string,
    limit: number = 10,
    includeScore: boolean = true
  ): Promise<SearchResponse> {
    const response: AxiosResponse<SearchResponse> = await apiClient.get('/api/v1/search', {
      params: { q: query, limit, includeScore }
    });
    return response.data;
  }

  static async getDocument(id: string): Promise<any> {
    const response: AxiosResponse<any> = await apiClient.get(`/api/v1/document/${id}`);
    return response.data;
  }

  static async deleteDocument(id: string): Promise<{ success: boolean }> {
    const response: AxiosResponse<{ success: boolean }> = await apiClient.delete(`/api/v1/document/${id}`);
    return response.data;
  }

  // Chat operations
  static async chat(request: ChatRequest): Promise<ChatResponse> {
    const response: AxiosResponse<ChatResponse> = await apiClient.post('/api/v1/chat', request);
    return response.data;
  }

  static async getConversation(id: string): Promise<Conversation> {
    const response: AxiosResponse<Conversation> = await apiClient.get(`/api/v1/conversations/${id}`);
    return response.data;
  }

  static async getAllConversations(): Promise<Conversation[]> {
    const response: AxiosResponse<Conversation[]> = await apiClient.get('/api/v1/conversations');
    return response.data;
  }

  static async deleteConversation(id: string): Promise<{ success: boolean }> {
    const response: AxiosResponse<{ success: boolean }> = await apiClient.delete(`/api/v1/conversations/${id}`);
    return response.data;
  }
}

export default ApiService; 