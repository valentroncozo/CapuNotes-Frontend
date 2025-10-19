// src/components/pages/cuerdas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC.jsx";
import { cuerdasService } from "@/services/cuerdasService.js";
import { cuerdaSchema, cuerdaEntityName } from "@/schemas/cuerdas.js";

export default function CuerdasPage() {
  return (
    <EntityTableABMC
      title="Cuerdas"
      service={cuerdasService}
      schema={cuerdaSchema}
      entityName={cuerdaEntityName}
      showBackButton
      sortable
    />
  );
}
