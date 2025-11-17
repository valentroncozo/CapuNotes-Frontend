// src/components/pages/cuerdas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { cuerdasService } from "@/services/cuerdasService";
import { cuerdaSchema, cuerdaUniqueBy, cuerdaEntityName } from "@/schemas/cuerdas";
import { useLocation } from "react-router-dom";

export default function CuerdasPage() {
  const location = useLocation();
  const openCreate = location.state?.openCreate || false;

  return (
    <div className="cuerdas-page">
      <EntityTableABMC
        title="Cuerdas"
        service={cuerdasService}
        schema={cuerdaSchema}
        uniqueBy={cuerdaUniqueBy}
        entityName={cuerdaEntityName}
        forceOpenCreate={openCreate}   // 👈 ACÁ SE PASA
      />
    </div>
  );
}

