// src/components/pages/areas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { areasService } from "@/services/areasService";
import { areaSchema, areaUniqueBy, areaEntityName } from "@/schemas/areas";

export default function AreasPage() {
  return (
    <EntityTableABMC
      title="Áreas"
      service={areasService}
      schema={areaSchema}
      uniqueBy={areaUniqueBy}
      entityName={areaEntityName}
    />
  );
}
