import { useCallback, useEffect, useState } from "react";

/**
 * useCrud(service, { storageKey, seed })
 * - storageKey: nombre para persistir offline en localStorage
 * - seed: array de datos semilla (si no hay nada en localStorage)
 */
export default function useCrud(service, { storageKey, seed = [] } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFromStorage = () => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const saveToStorage = (data) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await service.list();
      const arr = Array.isArray(data) ? data : [];
      setItems(arr);
      if (storageKey) saveToStorage(arr);
    } catch (e) {
      // Offline fallback
      const local = loadFromStorage();
      const arr = local ?? seed;
      setItems(arr);
      setError(""); // no mostramos error en modo offline
      if (storageKey && !local) saveToStorage(arr);
    } finally {
      setLoading(false);
    }
  }, [service, storageKey, seed]);

  const create = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const created = await service.create(payload);
      setItems((prev) => {
        const next = [created, ...prev];
        saveToStorage(next);
        return next;
      });
      return created;
    } catch (e) {
      // offline: creamos item local con id fake
      const localItem = { id: crypto.randomUUID(), ...payload };
      setItems((prev) => {
        const next = [localItem, ...prev];
        saveToStorage(next);
        return next;
      });
      return localItem;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, payload) => {
    setLoading(true);
    setError("");
    try {
      const upd = await service.update(id, payload);
      setItems((prev) => {
        const next = prev.map((it) => (it.id === id ? upd : it));
        saveToStorage(next);
        return next;
      });
      return upd;
    } catch (e) {
      // offline: actualizamos local
      setItems((prev) => {
        const next = prev.map((it) => (it.id === id ? { ...it, ...payload } : it));
        saveToStorage(next);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError("");
    try {
      await service.remove(id);
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id);
        saveToStorage(next);
        return next;
      });
    } catch (e) {
      // offline: borramos local
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id);
        saveToStorage(next);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, refresh, create, update, remove };
}
