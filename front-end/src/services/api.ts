import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 500, errors?: Record<string, string[]>, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
  }
}

// Request Queue for handling concurrent requests
class RequestQueue {
  private queue: Map<string, Promise<any>> = new Map();

  async execute<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.queue.has(key)) {
      return this.queue.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.queue.delete(key);
    });

    this.queue.set(key, promise);
    return promise;
  }

  clear() {
    this.queue.clear();
  }
}

// Cache Manager for API responses
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// API Service Class
class ApiService {
  private client: AxiosInstance;
  private requestQueue: RequestQueue;
  private cache: CacheManager;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.requestQueue = new RequestQueue();
    this.cache = new CacheManager();

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add timestamp for cache busting
        if (config.method === 'get' && !config.params?.nocache) {
          config.params = { ...config.params, _t: Date.now() };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

         // Response Interceptor
     this.client.interceptors.response.use(
       (response: AxiosResponse) => {
         // Handle successful responses
         return response;
       },
             async (error: AxiosError) => {
         // Handle network errors
         if (!error.response) {
           const networkError = new ApiError(
             'Network error. Please check your connection.',
             0,
             undefined,
             true
           );
           this.handleError(networkError);
           return Promise.reject(networkError);
         }

         // Handle HTTP errors
         const { status, data } = error.response;
         let message = 'An unexpected error occurred';

         switch (status) {
           case 400:
             message = data?.error || 'Bad request';
             break;
           case 401:
             message = 'Unauthorized. Please log in again.';
             this.handleUnauthorized();
             break;
           case 403:
             message = 'Access denied';
             break;
           case 404:
             message = data?.error || 'Resource not found';
             break;
           case 422:
             message = data?.error || 'Validation failed';
             break;
           case 429:
             message = 'Too many requests. Please try again later.';
             break;
           case 500:
             message = 'Server error. Please try again later.';
             break;
           default:
             message = data?.error || `HTTP ${status} error`;
         }

         const apiError = new ApiError(message, status, data?.errors);
         this.handleError(apiError);
         return Promise.reject(apiError);
       }
    );
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(error: ApiError): void {
    // Log error for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.status,
      errors: error.errors,
      isNetworkError: error.isNetworkError,
    });

    // Show user-friendly error message in console for now
    if (!error.isNetworkError) {
      console.error('Error:', error.message);
    } else {
      console.error('Connection error. Please check your internet connection.');
    }
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Generic request methods with caching and queuing
  async get<T>(url: string, config?: AxiosRequestConfig, useCache: boolean = true): Promise<T> {
    const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const queueKey = `GET:${url}`;
    return this.requestQueue.execute(queueKey, async () => {
      const response = await this.client.get<T>(url, config);
      const data = response.data;
      
      if (useCache) {
        this.cache.set(cacheKey, data);
      }
      
      return data;
    });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Retry mechanism for failed requests
  async retryRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (this.retryCount < this.maxRetries && error instanceof ApiError && error.status >= 500) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn);
      }
      
      this.retryCount = 0;
      throw error;
    }
  }

  // Cache management
  invalidateCache(pattern?: string): void {
    if (pattern) {
      this.cache.invalidatePattern(pattern);
    } else {
      this.cache.clear();
    }
  }

  // File upload helper
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  // Batch requests helper
  async batchRequests<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(request => request()));
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types and utilities
export type { AxiosRequestConfig, AxiosResponse };
export { RequestQueue, CacheManager };
