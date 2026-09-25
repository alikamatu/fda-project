export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetcher<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // For cookies/session-based auth
  };

  const response = await fetch(`/api${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
    }));

    throw new ApiError(
      response.status,
      errorData.message || 'Request failed',
      errorData.code
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}