// src/components/pages/cuerdas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { cuerdasService } from "@/services/cuerdasService";
import { cuerdaSchema, cuerdaUniqueBy, cuerdaEntityName } from "@/schemas/cuerdas";

export default function CuerdasPage() {
  return (
    <div className="cuerdas-page">
      <EntityTableABMC
        title="Cuerdas"
        service={cuerdasService}
        schema={cuerdaSchema}
        uniqueBy={cuerdaUniqueBy}
        entityName={cuerdaEntityName}
      />
    </div>
  );
}
