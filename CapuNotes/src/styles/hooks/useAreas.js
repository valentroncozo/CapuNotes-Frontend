// src/hooks/useAreas.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { areasApi } from '../services/areasApi';

function normalize(str) {
  return (str || '').trim();
}

export default function useAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await areasApi.list();
      setAreas(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('No se pudieron cargar las áreas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const existsByNombre = useCallback((nombre, exceptId = null) => {
    const n = normalize(nombre).toLowerCase();
    return areas.some(a => a.nombre?.toLowerCase() === n && a.id !== exceptId);
  }, [areas]);

  const addArea = useCallback(async ({ nombre, descripcion }) => {
    const nombreN = normalize(nombre);
    const descripcionN = normalize(descripcion);
    if (!nombreN) throw new Error('El nombre es obligatorio.');
    if (nombreN.length > 80) throw new Error('El nombre no puede superar los 80 caracteres.');
    if (descripcionN.length > 300) throw new Error('La descripción no puede superar los 300 caracteres.');
    if (existsByNombre(nombreN)) throw new Error('Ya existe un área con ese nombre.');

    const created = await areasApi.create({ nombre: nombreN, descripcion: descripcionN });
    setAreas(prev => [...prev, created]);
    return created;
  }, [existsByNombre]);

  const editArea = useCallback(async ({ id, nombre, descripcion }) => {
    const nombreN = normalize(nombre);
    const descripcionN = normalize(descripcion);
    if (!id) throw new Error('Falta el ID.');
    if (!nombreN) throw new Error('El nombre es obligatorio.');
    if (nombreN.length > 80) throw new Error('El nombre no puede superar los 80 caracteres.');
    if (descripcionN.length > 300) throw new Error('La descripción no puede superar los 300 caracteres.');
    if (existsByNombre(nombreN, id)) throw new Error('Ya existe un área con ese nombre.');

    const updated = await areasApi.update({ id, nombre: nombreN, descripcion: descripcionN });
    setAreas(prev => prev.map(a => (a.id === id ? updated : a)));
    return updated;
  }, [existsByNombre]);

  const removeArea = useCallback(async (id) => {
    if (!id) throw new Error('Falta el ID.');
    await areasApi.remove(id);
    setAreas(prev => prev.filter(a => a.id !== id));
    return { ok: true };
  }, []);

  const state = useMemo(() => ({ areas, loading, error }), [areas, loading, error]);
  const actions = useMemo(() => ({ load, addArea, editArea, removeArea }), [load, addArea, editArea, removeArea]);

  return { ...state, ...actions };
}
