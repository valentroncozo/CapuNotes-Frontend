import api from "./api.js";

export const miembrosApi = {
  listar: () => api.get("/miembros"),
  buscar: (filtro) => api.get(`/miembros/buscar?filtro=${encodeURIComponent(filtro)}`),
  crear: (miembro) => api.post("/miembros", miembro),
  actualizar: (miembro) => api.put("/miembros", miembro),
  eliminar: (nroDocumento, tipoDocumento) =>
    api.del(`/miembros/${nroDocumento}/${tipoDocumento}`),
};

