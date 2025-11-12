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
// TEMPORAL: Llamar directamente al backend sin proxy para debug
// En desarrollo usa URL directa al backend
// En producción usa variable de entorno o ruta absoluta
const BASE = import.meta.env.DEV ? 'http://localhost:8080' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
let CSRF_HEADER = 'X-XSRF-TOKEN'; // puedes cambiar con setCsrfHeaderName()

export function setCsrfHeaderName(name) {
  CSRF_HEADER = name;
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  console.log(`🔎 getCookie("${name}"):`, { 
    buscando: name, 
    cookiesDisponibles: cookies,
    totalCookies: cookies.length,
    documentCookie: document.cookie
  });
  const m = cookies.find(c => c.startsWith(name + '='));
  let value = m ? decodeURIComponent(m.split('=').slice(1).join('=')) : null;
  
  // Fallback: si la cookie no está accesible desde document.cookie (problema cross-domain),
  // intentar leerla desde localStorage
  if (!value && name === 'XSRF-TOKEN') {
    value = localStorage.getItem('XSRF-TOKEN');
    if (value) {
      console.log(`💾 getCookie("${name}") encontrado en localStorage:`, value);
    }
  }
  
  console.log(`🔎 getCookie("${name}") resultado:`, value);
  return value;
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
  
  // Si BASE está vacío (desarrollo), usar ruta relativa directamente
  if (!BASE) {
    if (!params || Object.keys(params).length === 0) {
      return pathWithSlash;
    }
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) searchParams.set(k, String(v));
    });
    return `${pathWithSlash}?${searchParams.toString()}`;
  }
  
  // Si BASE tiene valor (producción), construir URL completa
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
      console.log('🔐 CSRF Debug:', {
        path,
        method,
        cookieName: CSRF_COOKIE_NAME,
        cookieValue: xsrf,
        allCookies: document.cookie,
        willAddHeader: !!xsrf
      });
      if (xsrf) {
        init.headers[CSRF_HEADER] = xsrf;
        console.log('✅ CSRF header agregado:', CSRF_HEADER, '=', xsrf);
      } else {
        console.warn('⚠️ Cookie CSRF no encontrada! Cookies disponibles:', document.cookie);
      }
    }

    const url = buildUrl(path, params);
    console.log('📤 Request:', { method, url, headers: init.headers });
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
