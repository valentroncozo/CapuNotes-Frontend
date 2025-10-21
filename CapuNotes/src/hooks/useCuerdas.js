// src/hooks/useCuerdas.js
import useEntityCrud from "@/hooks/useEntityCrud.js";
import { cuerdasService } from "@/services/cuerdasService.js";

export default function useCuerdas() {
  return useEntityCrud(cuerdasService, { entityLabel: "cuerda" });
}
