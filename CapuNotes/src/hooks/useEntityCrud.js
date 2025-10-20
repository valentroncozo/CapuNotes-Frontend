// src/hooks/useEntityCrud.js
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

/**
 * Hook genérico de CRUD basado en cualquier "service"
 * con interfaz list(), create(), update(), remove().
 *
 * Opciones:
 *  - entityLabel: texto a mostrar en errores ("Área", "Miembro", etc.)
 *  - autoLoad: carga automática al montar (default true)
 */
export default function useEntityCrud(service, { entityLabel = "registro", autoLoad = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  // === LIST ===
  const list = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error list()", err);
      setError("No se pudieron cargar los datos.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudieron cargar ${entityLabel}s.`,
        confirmButtonColor: "#ffc107",
        background: "#11103a",
        color: "#E8EAED",
      });
    } finally {
      setLoading(false);
    }
  }, [service, entityLabel]);

  // === CREATE ===
  const create = useCallback(
    async (payload) => {
      try {
        const created = await service.create(payload);
        setItems((prev) => [...prev, created]);
        return created;
      } catch (err) {
        console.error("Error create()", err);
        handleError(err, `crear ${entityLabel}`);
        throw err;
      }
    },
    [service, entityLabel]
  );

  // === UPDATE ===
  const update = useCallback(
    async (payload) => {
      try {
        const updated = await service.update(payload);
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        return updated;
      } catch (err) {
        console.error("Error update()", err);
        handleError(err, `actualizar ${entityLabel}`);
        throw err;
      }
    },
    [service, entityLabel]
  );

  // === REMOVE ===
  const remove = useCallback(
    async (id) => {
      try {
        await service.remove(id);
        setItems((prev) => prev.filter((x) => x.id !== id));
        return { ok: true };
      } catch (err) {
        console.error("Error remove()", err);
        handleError(err, `eliminar ${entityLabel}`);
        throw err;
      }
    },
    [service, entityLabel]
  );

  // === ERRORES ===
  const handleError = (err, action = "operar") => {
    let msg = `No se pudo ${action}.`;
    if (err.name === "DuplicateError") msg = err.message;
    else if (err.message) msg = err.message;

    Swal.fire({
      icon: "error",
      title: "Error",
      text: msg,
      confirmButtonColor: "#ffc107",
      background: "#11103a",
      color: "#E8EAED",
    });
  };

  useEffect(() => {
    if (autoLoad) list();
  }, [autoLoad, list]);

  const state = useMemo(
    () => ({ items, loading, error, count: items.length }),
    [items, loading, error]
  );
  const actions = useMemo(
    () => ({ list, create, update, remove }),
    [list, create, update, remove]
  );

  return { ...state, ...actions };
}
