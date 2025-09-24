// src/services/areas.js
import { api } from "./api";

export const areasApi = {
  listar: () => api.get("/areas/all"),
  crear: (data) => api.post("/areas", data),
  eliminarPorId: (id) => api.del(`/areas/area/${id}`),
  eliminarPorNombre: (name) => api.del(`/areas/${name}`),
}