// src/services/historialService.js
// Se genera a partir de la lista de candidatos

import { candidatosService } from "./candidatosService.js";

const nombreCompleto = (r) => {
  const ape = String(r.apellido || "").trim();
  const nom = String(r.nombre || "").trim();
  return ape && nom ? `${nom} ${ape}` : (nom || ape || r.nombreLabel || "—");
};

export const historialService = {
  async list() {
    const candidatos = await candidatosService.list();

    // Mapeo simple: una fila por candidato/turno
    const rows = (candidatos || []).map((r, idx) => ({
      id: r.id ?? `h-${idx + 1}`,
      nombre: nombreCompleto(r),
      fechaAudicion: String(r?.inscripcion?.diaAudicion || r?.dia || r?.fechaAudicion || "—"),
      cancion: String(r?.cancion || "—"),
      resultado: {
        estado: r?.resultado?.estado || "Sin resultado",
        obs: r?.resultado?.obs || "",
      },
      inscripcion: r?.inscripcion || null,
    }));

    return rows;
  },
};
