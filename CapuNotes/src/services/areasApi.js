// src/services/areasApi.js
/**
 * Servicio de Áreas listo para backend.
 * Hoy usa localStorage; mañana, solo cambiamos implementaciones de fetch.
 */

const STORAGE_KEY = 'capunotes_areas';
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function safeGetJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

/* =========================
 * Implementación localStorage
 * ========================= */
async function listLocal() {
  return safeGetJSON(STORAGE_KEY);
}
async function createLocal({ nombre, descripcion }) {
  const list = safeGetJSON(STORAGE_KEY);
  const id = crypto?.randomUUID?.() || Date.now();
  const nuevo = { id, nombre, descripcion: descripcion?.trim() || '' };
  safeSetJSON(STORAGE_KEY, [...list, nuevo]);
  return nuevo;
}
async function updateLocal({ id, nombre, descripcion }) {
  const list = safeGetJSON(STORAGE_KEY);
  const updated = list.map(a => (a.id === id ? { ...a, nombre, descripcion } : a));
  safeSetJSON(STORAGE_KEY, updated);
  return updated.find(a => a.id === id) || null;
}
async function removeLocal(id) {
  const list = safeGetJSON(STORAGE_KEY);
  const filtered = list.filter(a => a.id !== id);
  safeSetJSON(STORAGE_KEY, filtered);
  return { ok: true };
}

/* =========================
 * Implementación backend (stubs)
 * ========================= */
async function listRemote() {
  // GET `${BASE_URL}/areas`
  const res = await fetch(`${BASE_URL}/areas`);
  if (!res.ok) throw new Error('Error listando áreas');
  return res.json();
}
async function createRemote({ nombre, descripcion }) {
  const res = await fetch(`${BASE_URL}/areas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion }),
  });
  if (!res.ok) throw new Error('Error creando área');
  return res.json();
}
async function updateRemote({ id, nombre, descripcion }) {
  const res = await fetch(`${BASE_URL}/areas/${id}`, {
    method: 'PUT', // o PATCH según API
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion }),
  });
  if (!res.ok) throw new Error('Error actualizando área');
  return res.json();
}
async function removeRemote(id) {
  const res = await fetch(`${BASE_URL}/areas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error eliminando área');
  return { ok: true };
}

/* =========================
 * Selector de implementación
 * ========================= */
export const areasApi = {
  list: (...args) => (USE_BACKEND ? listRemote(...args) : listLocal(...args)),
  create: (...args) => (USE_BACKEND ? createRemote(...args) : createLocal(...args)),
  update: (...args) => (USE_BACKEND ? updateRemote(...args) : updateLocal(...args)),
  remove: (...args) => (USE_BACKEND ? removeRemote(...args) : removeLocal(...args)),
};

// Exportamos la key por si alguna pantalla quiere leer sin servicio
export { STORAGE_KEY };
