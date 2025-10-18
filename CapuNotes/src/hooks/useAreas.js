// src/hooks/useAreas.js
import useEntityCrud from "@/hooks/useEntityCrud.js";
import { areasService } from "@/services/areasService.js";

export default function useAreas() {
  return useEntityCrud(areasService, { entityLabel: "área" });
}
