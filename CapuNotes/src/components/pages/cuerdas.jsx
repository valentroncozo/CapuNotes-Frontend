// src/components/pages/cuerdas.jsx
import EntityTableABMC from "../abmc/EntityTableABMC";

// Persistencia local para cuerdas
const STORAGE = "capunotes_cuerdas";

const cuerdasApi = {
  list: async () => JSON.parse(localStorage.getItem(STORAGE) || "[]"),
  create: async (c) => {
    const list = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    const id = crypto?.randomUUID?.() || Date.now();
    const nuevo = { id, ...c };
    localStorage.setItem(STORAGE, JSON.stringify([...list, nuevo]));
    return nuevo;
  },
  update: async (updated) => {
    const list = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    const newList = list.map((l) => (l.id === updated.id ? updated : l));
    localStorage.setItem(STORAGE, JSON.stringify(newList));
    return updated;
  },
  remove: async (id) => {
    const list = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    const newList = list.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE, JSON.stringify(newList));
    return { ok: true };
  },
};

export default function Cuerdas() {
  // ⚠️ Sin columna ID: el schema solo define "Nombre"
  const schema = [{ key: "nombre", label: "Nombre", required: true, max: 80 }];

  return (
    <EntityTableABMC
      title="Cuerdas"
      service={cuerdasApi}
      schema={schema}
      uniqueBy="nombre"
      entityName="cuerda"
    />
  );
}
