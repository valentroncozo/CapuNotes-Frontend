import EntityABMCSimple from "@/components/abmc/EntityABMCSimple";
import { categoriasCancionesService } from "@/services/categoriasCancionesService";

const categoriaSchema = [
  { key: "nombre", label: "Nombre", required: true, type: "text" },
  { key: "descripcion", label: "Descripción", required: true, type: "text" },
  { key: "primary", label: "Guardar", type: "submit" },
];

export default function CategoriasCancionesPage() {
  return (
    <EntityABMCSimple
      title="Categorías de canciones"
      service={categoriasCancionesService}
      schema={categoriaSchema}
      uniqueBy="nombre"
      entityName="categoría de canción"
      showBackButton
    />
  );
}
