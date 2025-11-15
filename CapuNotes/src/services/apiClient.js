// src/services/apiClient.js
import axios from 'axios';

const isBrowser = typeof window !== 'undefined';

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:8080'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 segundos
});

const JSON_METHODS = new Set(['post', 'put', 'patch', 'delete']);
const AUTH_ENDPOINTS = new Set([
  '/auth/login',
  '/auth/logout',
  '/auth/refresh'
]);

let refreshPromise = null;

const normalizePathname = (url) => {
  if (!url) return '';
  try {
    const fallbackBase = axiosInstance.defaults.baseURL || (isBrowser ? window.location.origin : 'http://localhost');
    const parsed = new URL(url, fallbackBase);
    return parsed.pathname;
  } catch (_err) {
    return url;
  }
};

const shouldAttemptRefresh = (config = {}) => {
  if (!config) return false;
  if (config.skipAuthRefresh) return false;
  const pathname = normalizePathname(config.url);
  if (!pathname) return false;
  return !AUTH_ENDPOINTS.has(pathname);
};

const ensureRefreshed = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axiosInstance.post('/auth/refresh', null, {
    skipAuthRefresh: true
  }).catch((err) => {
    throw err;
  }).finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

// Interceptor de requests para logging y encabezados dinámicos
axiosInstance.interceptors.request.use(
  function onFulfilled(config) {
    const method = (config && config.method ? config.method : 'get').toLowerCase();
    const base = config && config.baseURL ? config.baseURL : '';
    const targetUrl = config && config.url ? config.url : '';
    console.log('📤 ' + method.toUpperCase() + ' ' + base + targetUrl);

    if (!config.headers) config.headers = {};

    // Garantizar Content-Type para requests JSON
    const isFormData = config.data instanceof FormData;
    if (JSON_METHODS.has(method) && !isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  function onRejected(error) {
    return Promise.reject(error);
  }
);

// Interceptor de responses (manejo de errores global)
axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    const cfg = response && response.config ? response.config : {};
    const method = (cfg.method || 'get').toUpperCase();
    const url = cfg.url || '';
    console.log('✅ ' + method + ' ' + url + ' - ' + response.status);

    return response.data; // Devolver solo los datos
  },
  async function onRejected(error) {
    const cfg = error && error.config ? error.config : {};
    const method = cfg.method ? cfg.method.toUpperCase() : 'REQUEST';
    const url = cfg.url || '';
    const data = error && error.response ? error.response.data : undefined;
    const message = data || error.message;
    if (!cfg?.suppressErrorLog) {
      console.error('❌ Error en ' + method + ' ' + url + ':', message);
    }

    const status = error && error.response ? error.response.status : undefined;
    const config = cfg;

    if (status === 401 && config && !config._retry && shouldAttemptRefresh(config)) {
      console.warn('⚠️ No autorizado - intentando refresh automático de sesión');
      config._retry = true;

      try {
        await ensureRefreshed();
      } catch (refreshErr) {
        const refreshMsg = refreshErr && refreshErr.response ? refreshErr.response.data : refreshErr && refreshErr.message ? refreshErr.message : refreshErr;
        console.error('❌ Refresh token falló:', refreshMsg);
        throw error;
      }

      return axiosInstance(config);
    }

    throw error;
  }
);

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

function extractDataAndConfig(options) {
  if (options == null) {
    return { data: undefined, config: {} };
  }

  if (!isPlainObject(options)) {
    return { data: options, config: {} };
  }

  const { body, data, ...rest } = options;

  if (body !== undefined) {
    return { data: body, config: rest };
  }

  if (data !== undefined) {
    return { data, config: rest };
  }

  return { data: undefined, config: rest };
}

// API pública simplificada
export const apiClient = {
  get: (url, config) => axiosInstance.get(url, config),
  post: (url, options) => {
    const { data, config } = extractDataAndConfig(options);
    return axiosInstance.post(url, data, config);
  },
  put: (url, options) => {
    const { data, config } = extractDataAndConfig(options);
    return axiosInstance.put(url, data, config);
  },
  patch: (url, options) => {
    const { data, config } = extractDataAndConfig(options);
    return axiosInstance.patch(url, data, config);
  },
  delete: (url, options) => {
    const { data, config } = extractDataAndConfig(options);
    const finalConfig = data !== undefined ? { ...config, data } : config;
    return axiosInstance.delete(url, finalConfig);
  }
};

export default apiClient;
