// src/services/localStorageApi.js

/**
 * Factory CRUD homogéneo sobre localStorage con:
 * - Validación de duplicados por uniqueBy (string | string[])
 * - Comparación case-insensitive y trim
 * - Errores tipados para manejo consistente en UI
 */

export class CrudError extends Error {
  constructor(message, code = "GENERIC") {
    super(message);
    this.name = "CrudError";
    this.code = code;
  }
}

export class DuplicateError extends CrudError {
  constructor(message = "Registro duplicado.") {
    super(message, "DUPLICATE");
    this.name = "DuplicateError";
  }
}

function safeReadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(storageKey, arr) {
  localStorage.setItem(storageKey, JSON.stringify(arr));
}

const norm = (v) => (v ?? "").toString().trim().toLowerCase();

function makeIsDuplicate(uniqueBy) {
  if (!uniqueBy) return () => false;
  const fields = Array.isArray(uniqueBy) ? uniqueBy : [uniqueBy];
  return (a, b) => fields.every((k) => norm(a?.[k]) === norm(b?.[k]));
}

/**
 * @param {string} storageKey
 * @param {{ uniqueBy?: string|string[], messages?: Partial<{createDuplicate:string, updateDuplicate:string}>, idFactory?: ()=>string|number }} [opts]
 * @returns {{list:Function, create:Function, update:Function, remove:Function, clear:Function}}
 */
export function localStorageApi(storageKey, opts = {}) {
  const {
    uniqueBy = null,
    idFactory = () => (crypto?.randomUUID?.() ? crypto.randomUUID() : Date.now()),
    messages = {}
  } = opts;

  const isDuplicate = makeIsDuplicate(uniqueBy);
  const msgCreateDup =
    messages.createDuplicate || "Ya existe un registro con los mismos campos únicos.";
  const msgUpdateDup =
    messages.updateDuplicate || "La actualización generaría un duplicado con otro registro.";

  return {
    /** Devuelve el array completo */
    async list() {
      return safeReadJson(storageKey);
    },

    /** Crea un registro, validando duplicados */
    async create(obj) {
      const list = safeReadJson(storageKey);
      const nuevo = { id: idFactory(), ...obj };

      if (uniqueBy && list.some((x) => isDuplicate(x, nuevo))) {
        throw new DuplicateError(msgCreateDup);
      }

      const next = [...list, nuevo];
      writeAll(storageKey, next);
      return nuevo;
    },

    /** Actualiza por id, validando duplicados contra terceros */
    async update(updated) {
      if (updated?.id == null) {
        throw new CrudError("Falta el ID para actualizar.", "MISSING_ID");
      }

      const list = safeReadJson(storageKey);
      const exists = list.find((x) => String(x.id) === String(updated.id));
      if (!exists) {
        throw new CrudError("No se encontró el registro a actualizar.", "NOT_FOUND");
      }

      if (
        uniqueBy &&
        list.some(
          (x) => String(x.id) !== String(updated.id) && isDuplicate(x, { ...exists, ...updated })
        )
      ) {
        throw new DuplicateError(msgUpdateDup);
      }

      const next = list.map((x) =>
        String(x.id) === String(updated.id) ? { ...x, ...updated } : x
      );
      writeAll(storageKey, next);
      return next.find((x) => String(x.id) === String(updated.id));
    },

    /** Elimina por id (idempotente) */
    async remove(id) {
      const list = safeReadJson(storageKey);
      const next = list.filter((x) => String(x.id) !== String(id));
      writeAll(storageKey, next);
      return { ok: true };
    },

    /** Limpia todo (útil para tests) */
    async clear() {
      writeAll(storageKey, []);
      return { ok: true };
    }
  };
}
