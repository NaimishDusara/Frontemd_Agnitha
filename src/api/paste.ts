import type {
  CreatePasteRequest,
  CreatePasteResponse,
  PasteData,
  ApiError,
} from '../types/Paste';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendagnitha-production.up.railway.app';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'An unexpected error occurred',
      }));
      throw new Error(error.error);
    }
    return response.json();
  }

  async createPaste(data: CreatePasteRequest): Promise<CreatePasteResponse> {
    const response = await fetch(`${API_BASE_URL}/api/pastes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<CreatePasteResponse>(response);
  }

  async getPaste(id: string): Promise<PasteData> {
    const response = await fetch(`${API_BASE_URL}/api/pastes/${id}`);
    return this.handleResponse<PasteData>(response);
  }

  async checkHealth(): Promise<{ ok: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/healthz`);
    return this.handleResponse<{ ok: boolean }>(response);
  }
}

export const apiService = new ApiService();