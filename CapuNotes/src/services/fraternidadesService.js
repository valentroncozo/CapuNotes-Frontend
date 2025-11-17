// src/services/fraternidadesService.js
import apiClient from "./apiClient";

const API_URL = "/fraternidades";


const mapMember = (m = {}) => ({
  id: {
    tipoDocumento: m.tipoDocumento || m.id?.tipoDocumento || "DNI",
    nroDocumento: m.nroDocumento || m.id?.nroDocumento || "",
  },
  nombre: m.nombre || "",
  apellido: m.apellido || "",
  area: m.areaNombre || m.area || null,
  areaId: m.areaId || null,
  cuerda: m.cuerdaNombre || m.cuerda || null,
  cuerdaId: m.cuerdaId || null,
  activo: m.activo !== false,
});

const mapDetail = (data = {}) => ({
  id: data.id,
  nombre: data.name,
  cantidadMiembros: data.miembrosCount ?? (Array.isArray(data.miembros) ? data.miembros.length : 0),
  miembros: Array.isArray(data.miembros) ? data.miembros.map(mapMember) : [],
});


const serializeMembers = (miembros = []) =>
  miembros
    .map((m) => ({
      nroDocumento: (m.id?.nroDocumento || m.nroDocumento || "").trim(),
      tipoDocumento: (m.id?.tipoDocumento || m.tipoDocumento || "DNI").trim(),
    }))
    .filter((m) => m.nroDocumento);

const buildPayload = (data = {}) => ({
  name: data.nombre?.trim(),
  miembros: serializeMembers(data.miembros || []),
});

export const fraternidadesService = {
  list: async () => {
    const data = await apiClient.get(API_URL);
    return (data || []).map((f) => ({ id: f.id, nombre: f.name }));
  },

  get: async (id) => {
    const res = await apiClient.get(`${API_URL}/${id}`);
    return mapDetail(res); // res ya es el data
  },

  create: async (data) => {
    const payload = buildPayload(data);
    const result = await apiClient.post(API_URL, { body: payload });
    return { id: result.id, nombre: result.name };
  },

  // Actualizar
  update: async (id, data) => {
    const payload = buildPayload(data);
    const result = await apiClient.put(`${API_URL}/${id}`, { body: payload });
    return { id: result.id, nombre: result.name };
  },

  remove: async (id) => {
    await apiClient.delete(`${API_URL}/${id}`);
  },

  listAvailableMembers: async (filters = {}) => {
    const res = await apiClient.get(`${API_URL}/miembros-disponibles`, {
      params: {
        areaId: filters.areaId || undefined,
        cuerdaId: filters.cuerdaId || undefined,
      },
    });
    return Array.isArray(res) ? res.map(mapMember) : [];
  },
};

