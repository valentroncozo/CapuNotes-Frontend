// src/pages/cuerdas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { localStorageApi } from "@/services/localStorageApi";
import { cuerdaSchema, cuerdaUniqueBy, cuerdaEntityName, CUERDA_STORAGE_KEY } from "@/schemas/cuerdas";

const cuerdasApi = localStorageApi(CUERDA_STORAGE_KEY);

export default function CuerdasPage() {
  return (
    <EntityTableABMC
      title="Cuerdas"
      service={cuerdasApi}
      schema={cuerdaSchema}
      uniqueBy={cuerdaUniqueBy}
      entityName={cuerdaEntityName}
    />
  );
}
