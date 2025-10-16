// src/components/pages/miembros/index.jsx
import EntityTableABMC from "@/components/abmc/EntityTableABMC";
import { miembrosService } from "@/services/miembrosService";
import { buildMiembroSchema, miembroEntityName } from "@/schemas/miembros";

export default function MiembrosPage() {
  const schema = buildMiembroSchema();
  return (
    <EntityTableABMC
      title="Miembros del coro"
      service={miembrosService}
      schema={schema}
      uniqueBy={null}
      entityName={miembroEntityName}
      showBackButton
    />
  );
}
