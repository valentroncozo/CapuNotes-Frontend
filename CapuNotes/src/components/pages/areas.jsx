// src/components/organizacion-coro/Area.jsx
import EntityTableABMC from "../abmc/EntityTableABMC";
import { areasApi } from "../../services/areasApi";

// ABMC genérico para Áreas (sin columna ID)
export default function Area() {
  const schema = [
    { key: "nombre", label: "Nombre", required: true, max: 80 },
    { key: "descripcion", label: "Descripción", max: 300 },
  ];

  return (
    <EntityTableABMC
      title="Áreas"
      service={areasApi}
      schema={schema}
      uniqueBy="nombre"
      entityName="área"
    />
  );
}
