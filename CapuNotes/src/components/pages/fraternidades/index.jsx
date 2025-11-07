// src/components/pages/fraternidades/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { fraternidadesService } from "@/services/fraternidadesService";
import { fraternidadSchema, fraternidadUniqueBy, fraternidadEntityName } from "@/schemas/fraternidades";

export default function FraternidadesPage() {
  return (
    <EntityTableABMC
      title="Fraternidades"
      service={fraternidadesService}
      schema={fraternidadSchema}
      uniqueBy={fraternidadUniqueBy}
      entityName={fraternidadEntityName}
    />
  );
}

