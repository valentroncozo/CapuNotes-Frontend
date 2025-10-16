// src/components/pages/miembros.jsx
import EntityTableABMC from "../abmc/EntityTableABMC";

const STORAGE = "capunotes_miembros";
const AREAS_KEY = "capunotes_areas";
const CUERDAS_KEY = "capunotes_cuerdas";

const miembrosApi = {
  list: async () => JSON.parse(localStorage.getItem(STORAGE) || "[]"),
  create: async (m) => {
    const list = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    const id = crypto?.randomUUID?.() || Date.now();
    const nuevo = { id, estado: "Activo", ...m };
    localStorage.setItem(STORAGE, JSON.stringify([...list, nuevo]));
    return nuevo;
  },
  update: async (updated) => {
    const list = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    const newList = list.map((l) => (l.id === updated.id ? { ...l, ...updated } : l));
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

function getOptionsFromLS(key, field = "nombre") {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    return (arr || []).map((x) => x?.[field]).filter(Boolean);
  } catch {
    return [];
  }
}

export default function MiembrosABMC() {
  const cuerdaOptions = getOptionsFromLS(CUERDAS_KEY);
  const areaOptions = getOptionsFromLS(AREAS_KEY);
  const estadoOptions = ["Activo", "Inactivo"];

  const schema = [
    { key: "nombre", label: "Nombre", required: true, max: 80 },
    { key: "apellido", label: "Apellido", required: true, max: 80 },
    { key: "cuerda", label: "Cuerda", type: "select", options: cuerdaOptions },
    { key: "area", label: "Área", type: "select", options: areaOptions },
    { key: "estado", label: "Estado", type: "select", options: estadoOptions },
  ];

  return (
    <EntityTableABMC
      title="Miembros del coro"
      service={miembrosApi}
      schema={schema}
      uniqueBy={null}         // no forzar duplicados por 'nombre'
      entityName="miembro"
      showBackButton={true}   // flechita en el header
    />
  );
}
