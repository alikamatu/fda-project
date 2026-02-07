const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private unauthorizedHandler: ((status: number, message?: string) => void) | null = null;

  setUnauthorizedHandler(handler: (status: number, message?: string) => void) {
    this.unauthorizedHandler = handler;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { body, headers: customHeaders, ...restConfig } = config;
    
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    // Only add Authorization header if token exists
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    // DEBUG: log token/header for troubleshooting auth issues in browser
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.debug('[apiClient] token:', token ? token.substring(0, 20) + '...' : 'null');
      // eslint-disable-next-line no-console
      console.debug('[apiClient] Authorization header:', (headers as Record<string, string>)['Authorization'] || 'not set');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...restConfig,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));

      // Handle unauthorized/forbidden errors globally before throwing
      if (response.status === 401 || response.status === 403) {
        if (this.unauthorizedHandler) {
          this.unauthorizedHandler(response.status, errorData.message);
        }
      }

      throw new ApiError(
        response.status,
        errorData.message || 'Request failed',
        errorData.code
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
