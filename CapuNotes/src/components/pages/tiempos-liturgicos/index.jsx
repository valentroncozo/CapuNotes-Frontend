import EntityABMCSimple from "@/components/abmc/EntityABMCSimple";
import { tiemposLiturgicosService } from "@/services/tiemposLiturgicosService";

const tiempoSchema = [
  { key: "nombre", label: "Nombre", required: true, type: "text" },
  { key: "descripcion", label: "Descripción", required: true, type: "text" },
  { key: "primary", label: "Guardar", type: "submit" },
];

export default function TiemposLiturgicosPage() {
  return (
    <EntityABMCSimple
      title="Tiempos litúrgicos"
      service={tiemposLiturgicosService}
      schema={tiempoSchema}
      uniqueBy="nombre"
      entityName="tiempo litúrgico"
      showBackButton
    />
  );
}
