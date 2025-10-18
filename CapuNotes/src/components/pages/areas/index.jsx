// src/components/pages/areas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC.jsx";
import { areasService } from "@/services/areasService.js";
import { areaSchema, areaUniqueBy, areaEntityName } from "@/schemas/areas.js";

export default function AreasPage() {
  return (
    <EntityTableABMC
      title="Áreas"
      service={areasService}
      schema={areaSchema}
      uniqueBy={areaUniqueBy}
      entityName={areaEntityName}
      showBackButton
    />
  );
}
