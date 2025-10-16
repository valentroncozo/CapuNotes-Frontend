// src/pages/miembros/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { localStorageApi } from "@/services/localStorageApi";
import { buildMiembroSchema, miembroEntityName, MIEMBRO_STORAGE_KEY } from "@/schemas/miembros";

const miembrosApi = localStorageApi(MIEMBRO_STORAGE_KEY);

export default function MiembrosPage() {
  // Lee opciones actualizadas (cuerdas/áreas) desde LS en cada render
  const schema = buildMiembroSchema();

  return (
    <EntityTableABMC
      title="Miembros del coro"
      service={miembrosApi}
      schema={schema}
      uniqueBy={null}
      entityName={miembroEntityName}
      showBackButton
    />
  );
}
