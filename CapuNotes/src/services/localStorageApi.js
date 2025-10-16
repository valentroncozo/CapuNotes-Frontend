// Factory CRUD sobre localStorage con una interfaz homogénea
export function localStorageApi(storageKey) {
  const readAll = () => JSON.parse(localStorage.getItem(storageKey) || "[]");
  const writeAll = (arr) => localStorage.setItem(storageKey, JSON.stringify(arr));

  return {
    list: async () => readAll(),
    create: async (obj) => {
      const list = readAll();
      const id = crypto?.randomUUID?.() || Date.now();
      const nuevo = { id, ...obj };
      writeAll([...list, nuevo]);
      return nuevo;
    },
    update: async (updated) => {
      const list = readAll();
      const newList = list.map((x) => (x.id === updated.id ? { ...x, ...updated } : x));
      writeAll(newList);
      return updated;
    },
    remove: async (id) => {
      const list = readAll();
      writeAll(list.filter((x) => x.id !== id));
      return { ok: true };
    },
  };
}
