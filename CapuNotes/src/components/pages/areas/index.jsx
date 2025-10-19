// src/components/pages/areas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC.jsx";
import { areasService } from "@/services/areasService.js";
import { areaSchema, areaEntityName } from "@/schemas/areas.js";

export default function AreasPage() {
  return (
    <EntityTableABMC
      title="Áreas"
      service={areasService}
      schema={areaSchema}
      entityName={areaEntityName}
      showBackButton
      sortable
    />
  );
}
