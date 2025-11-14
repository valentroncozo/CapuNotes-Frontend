// src/services/reporteParticipacionService.js
import axios from "axios";

const REPORTES_API_URL = "/api/reportes";

export const reporteParticipacionService = {
  getReporteParticipacion: async (anio, estado = "todos") => {
    try {
      const url = `${REPORTES_API_URL}/participacion?anio=${anio}&estado=${estado}`;

      console.log("➡️ Solicitando reporte general de participación:", url);

      const res = await axios.get(url);

      console.log("✅ Reporte recibido:", res.data);

      return res.data; // <--- IMPORTANTE
    } catch (error) {
      console.error("❌ Error reporte participación:", error);
      throw error;
    }
  },
};
