// src/services/apiClient.js
export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function withTimeout(ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

function buildUrl(path, params) {
  // Permitir que VITE_API_BASE_URL sea absoluto (http...) o relativo (ej. '/api').
  const rawBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ?? '';
  const base = rawBase
    ? rawBase.startsWith('http')
      ? rawBase
      : `${window.location.origin}${rawBase}`
    : '';
  const pathWithSlash = path.startsWith('/') ? path : `/${path}`;
  // Si no hay base, usamos URL relativa (resuelta contra location.href)
  const urlString = base ? `${base}${pathWithSlash}` : pathWithSlash;
  const url = new URL(urlString, window.location.href);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function handleResponse(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, { status: res.status, details: data });
  }
  return data;
}

async function request(method, path, { params, body, headers, timeoutMs } = {}) {
  const { signal, clear } = withTimeout(timeoutMs);
  try {
    const isJson = body && typeof body === 'object' && !(body instanceof FormData);
    const init = {
      method,
      signal,
      headers: {
        ...(isJson ? { 'Content-Type': 'application/json' } : {}),
        Accept: 'application/json',
        ...(headers || {}),
      },
      body: isJson ? JSON.stringify(body) : body,
      credentials: 'include', // quitar si usás JWT puro sin cookies
    };
    const url = buildUrl(path, params);
    const res = await fetch(url, init);
    return await handleResponse(res);
  } catch (err) {
    if (err.name === 'AbortError') throw new ApiError('Request timeout', { status: 0 });
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network error', { status: 0 });
  } finally {
    clear();
  }
}

export const apiClient = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, opts) => request('POST', path, opts),
  put: (path, opts) => request('PUT', path, opts),
  patch: (path, opts) => request('PATCH', path, opts),
  delete: (path, opts) => request('DELETE', path, opts),
};
