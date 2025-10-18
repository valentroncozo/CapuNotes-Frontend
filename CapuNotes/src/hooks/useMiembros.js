// src/hooks/useMiembros.js
import useEntityCrud from "@/hooks/useEntityCrud.js";
import { miembrosService } from "@/services/miembrosService.js";

export default function useMiembros() {
  return useEntityCrud(miembrosService, { entityLabel: "miembro" });
}
