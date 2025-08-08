// Filter Mode Types
export type FilterMode = 'Quick Response' | 'Think Dipper';

export interface FilterModeResponse {
  success: boolean;
  mode: FilterMode;
  duration?: number;
  message: string;
}

// API Response Types
export interface EmbeddingResponse {
  success: boolean;
  documentId: string;
  contentHash: string;
  textRepresentation: string;
  embeddingDimension: number;
  metadata: {
    fieldCount: number;
    nestedLevels: number;
    dataTypes: string[];
    documentType: string;
    processedAt: string;
  };
}

export interface SearchResult {
  documentId: string;
  originalData: any;
  textRepresentation: string;
  similarityScore: number;
  metadata: {
    contentHash: string;
    processedAt: string;
    documentType: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface ChatSource {
  documentId: string;
  content: string;
  originalData: any;
  similarityScore: number;
  metadata: {
    documentType: string;
    processedAt: string;
  };
}

export interface ChatResponse {
  response: string;
  conversationId: string;
  sources: ChatSource[];
  metadata: {
    tokensUsed: number;
    processingTime: number;
    similarityScores: number[];
    llmProvider?: string;
    llmModel?: string;
  };
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  similarityThreshold?: number;
}

export interface Conversation {
  id: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// API Error Response
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Health Check Response
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
} 