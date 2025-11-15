// src/services/reporteAsistenciaMiembroAnualService.js
import axios from "axios";

const REPORTES_API_URL = "/api/reporte-asistencias";

export const reporteAsistenciaMiembroAnualService = {
  /**
   * 🔹 Obtener el reporte anual de asistencia de un miembro.
   * Ejemplo: GET /api/reporte-asistencias/miembros/DNI/43889911?anio=2025
   */
  getReporteMiembro: async (tipoDocumento, nroDocumento, anio) => {
    try {
      let url = `${REPORTES_API_URL}/miembros/${tipoDocumento}/${nroDocumento}`;
      if (anio) url += `?anio=${anio}`;

      console.log("➡️ Solicitando reporte:", url);

      const res = await axios.get(url);
      console.log("✅ Reporte recibido del backend:", res.data);

      return res.data;
    } catch (error) {
      console.error("❌ Error al obtener el reporte de asistencia:", error);
      throw error;
    }
  },
};

