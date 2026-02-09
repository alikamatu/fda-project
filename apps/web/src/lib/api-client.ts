import { tokenService } from '@/services/token.service';

interface RequestInit extends globalThis.RequestInit {
  headers?: HeadersInit;
}

type UnauthorizedHandler = (status: number, message?: string) => void;

class ApiClient {
  private baseUrl: string;
  private unauthorizedHandler?: UnauthorizedHandler;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
  }

  private getHeaders(headers?: HeadersInit): HeadersInit {
    const token = tokenService.getToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return {
      ...defaultHeaders,
      ...headers,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      const message = `Unauthorized (401)`;
      this.unauthorizedHandler?.(response.status, message);
      throw new Error(message);
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      const message = `Forbidden (403)`;
      this.unauthorizedHandler?.(response.status, message);
      throw new Error(message);
    }

    // Handle other error statuses
    if (!response.ok) {
      let message = `HTTP Error ${response.status}`;
      try {
        const error = await response.json();
        message = error.message || message;
      } catch {
        // Response wasn't JSON
      }
      throw new Error(message);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch {
      throw new Error('Failed to parse response');
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(options.headers),
      credentials: 'include', // Include cookies for CORS
    };

    console.log(`[ApiClient] ${config.method || 'GET'} ${endpoint}`, {
      hasToken: !!tokenService.getToken(),
      headers: config.headers,
    });

    try {
      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`[ApiClient] Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  setUnauthorizedHandler(handler: UnauthorizedHandler): void {
    this.unauthorizedHandler = handler;
  }
}

export const apiClient = new ApiClient();