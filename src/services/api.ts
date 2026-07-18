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
