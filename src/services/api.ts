const API_BASE = '/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    if (body?.error) throw new Error(body.error);
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getPortfolio() {
  return request('/portfolio');
}

export async function getQuotes() {
  return request('/quotes');
}

export async function createOrder(payload: { symbol: string; side: string; qty: number; price?: number }) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface AuthUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
}

export async function createAuthSession(payload: { fullName?: string; phoneNumber: string; verificationToken: string }) {
  return request<AuthUser>('/auth/session', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return request<AuthUser>('/auth/me', { credentials: 'include' });
}

export async function logout() {
  return request<{ status: string }>('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}
