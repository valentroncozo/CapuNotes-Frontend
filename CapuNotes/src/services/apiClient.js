// src/services/apiClient.js
export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// configuración base
const BASE = 'http://localhost:8080';
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
let CSRF_HEADER = 'X-XSRF-TOKEN'; // puedes cambiar con setCsrfHeaderName()

export function setCsrfHeaderName(name) {
  CSRF_HEADER = name;
}

export function getCookie(name) {
  const m = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  return m ? decodeURIComponent(m.split('=').slice(1).join('=')) : null;
}

export function csrfHeaders(additional = {}) {
  const xsrf = getCookie(CSRF_COOKIE_NAME);
  if (!xsrf) return { ...additional };
  return { ...additional, [CSRF_HEADER]: xsrf };
}

function withTimeout(ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

function buildUrl(path, params) {
  const p = String(path || '').trim();
  const pathWithSlash = p.startsWith('/') ? p : '/' + p;
  const url = new URL(BASE.replace(/\/+$/, '') + pathWithSlash, window.location.href);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function handleResponse(res) {
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  const text = await res.text().catch(() => null);
  const data = text && ct.includes('application/json')
    ? (() => { try { return JSON.parse(text); } catch { return text; } })()
    : text;

  if (!res.ok) {
    // emitir eventos globales para que el AuthContext pueda manejar navegación/refresh
    try {
      if (res.status === 403) {
        window.dispatchEvent(new CustomEvent('api-forbidden', { detail: { status: 403, body: data } }));
      } else if (res.status === 401) {
        window.dispatchEvent(new CustomEvent('api-unauthorized', { detail: { status: 401, body: data } }));
      }
    } catch (e) { /* ignore */ }

    const msg =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, { status: res.status, details: { parsed: data, raw: text } });
  }
  return data;
}

async function request(method, path, { params, body, headers = {}, timeoutMs } = {}) {
  const { signal, clear } = withTimeout(timeoutMs);
  try {
    const isJson = body && typeof body === 'object' && !(body instanceof FormData);
    const init = {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(isJson ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: isJson ? JSON.stringify(body) : body,
      credentials: 'include',
    };

    // adjuntar CSRF header para mutaciones (no GET) excepto login
    // el endpoint /api/auth/login está exento de CSRF en el backend
    const isLogin = path && (path.includes('/auth/login') || path.includes('/api/auth/login'));
    if (method && method.toUpperCase() !== 'GET' && !isLogin) {
      const xsrf = getCookie(CSRF_COOKIE_NAME);
      if (xsrf) init.headers[CSRF_HEADER] = xsrf;
    }

    const url = buildUrl(path, params);
    const res = await fetch(encodeURI(url), init);
    return await handleResponse(res);
  } catch (err) {
    if (err.name === 'AbortError') throw new ApiError('Request timeout', { status: 0 });
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network error', { status: 0 });
  } finally {
    clear();
  }
}

// wrappers públicos
export async function apiGet(path, opts = {}) { return request('GET', String(path).trim(), opts); }
export async function apiPost(path, opts = {}) { return request('POST', String(path).trim(), opts); }
export async function apiPatch(path, opts = {}) { return request('PATCH', String(path).trim(), opts); }
export async function apiDelete(path, opts = {}) { return request('DELETE', String(path).trim(), opts); }

export const apiClient = {
  get: apiGet,
  post: apiPost,
  patch: apiPatch,
  delete: apiDelete,
};

export default apiClient;
