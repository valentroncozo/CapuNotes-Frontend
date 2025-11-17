// src/services/fraternidadesService.js
import axios from "axios";

const API_URL = "/api/fraternidades";

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
    const res = await axios.get(API_URL);
    return (res.data || []).map((f) => ({
      id: f.id,
      nombre: f.name,
      cantidadMiembros: f.miembrosCount ?? 0,
    }));
  },

  get: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return mapDetail(res.data);
  },

  create: async (data) => {
    const res = await axios.post(API_URL, buildPayload(data));
    return mapDetail(res.data);
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, buildPayload(data));
    return mapDetail(res.data);
  },

  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  listAvailableMembers: async (filters = {}) => {
    const res = await axios.get(`${API_URL}/miembros-disponibles`, {
      params: {
        areaId: filters.areaId || undefined,
        cuerdaId: filters.cuerdaId || undefined,
      },
    });
    return Array.isArray(res.data) ? res.data.map(mapMember) : [];
  },
};

