export interface CreatePasteRequest {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface CreatePasteResponse {
  id: string;
  url: string;
}

export interface PasteData {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export interface ApiError {
  error: string;
}

export interface PasteFormData {
  content: string;
  ttlEnabled: boolean;
  ttlSeconds: string;
  maxViewsEnabled: boolean;
  maxViews: string;
}

export type PasteConstraints = {
  ttl_seconds?: number;
  max_views?: number;
};