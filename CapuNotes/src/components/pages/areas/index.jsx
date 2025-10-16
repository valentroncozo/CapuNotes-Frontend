// src/components/pages/areas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { localStorageApi } from "@/services/localStorageApi";
import {
  areaSchema,
  areaUniqueBy,
  areaEntityName,
  AREA_STORAGE_KEY,
} from "@/schemas/areas";

// 👇 No existe services/areasApi; usamos localStorage como backend local
const areasApi = localStorageApi(AREA_STORAGE_KEY);

export default function AreasPage() {
  return (
    <EntityTableABMC
      title="Áreas"
      service={areasApi}
      schema={areaSchema}
      uniqueBy={areaUniqueBy}
      entityName={areaEntityName}
    />
  );
}
