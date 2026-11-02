import { authClient } from './auth-client';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });
  } catch {
    throw new Error(
      `Cannot connect to BookNook API. Check that the server is running and NEXT_PUBLIC_API_URL is correct (${API}).`,
    );
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Request failed');
  return payload as T;
}
export const imageFallback =
  'https://placehold.co/640x420/e9e5dc/344054?text=BookNook';
