// src/components/pages/areas/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { areasService } from "@/services/areasService";
import { areaSchema, areaUniqueBy, areaEntityName } from "@/schemas/areas";
import { useLocation } from "react-router-dom";

export default function AreasPage() {

  const location = useLocation();
  const forceOpenCreate = location.state?.openCreate || false;

  return (
    <div className="areas-page">
      <EntityTableABMC
        title="Áreas"
        service={areasService}
        schema={areaSchema}
        uniqueBy={areaUniqueBy}
        entityName={areaEntityName}
        forceOpenCreate={forceOpenCreate}  
      />
    </div>
  );
}
