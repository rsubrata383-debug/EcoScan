import type { WasteResult, DemoItem } from '@/features/waste/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.status = status;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      let message = 'Request failed';
      try {
        const data = await res.json();
        message = data.message || message;
      } catch {
        message = `Server error (${res.status})`;
      }
      throw new ApiError(message, res.status);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The scan took too long. Please try again.', 408);
    }
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }
}

export async function getStatus(): Promise<{ aiEnabled: boolean }> {
  return fetchJson(`${API_BASE}/api/status`);
}

export async function scanImage(file: Blob): Promise<WasteResult> {
  const formData = new FormData();
  formData.append('image', file);
  return fetchJson(`${API_BASE}/api/scan`, {
    method: 'POST',
    body: formData,
  });
}

export async function getDemoItems(): Promise<DemoItem[]> {
  return fetchJson(`${API_BASE}/api/demo`);
}

export async function getDemoResult(id: string): Promise<WasteResult> {
  return fetchJson(`${API_BASE}/api/demo/${id}`);
}