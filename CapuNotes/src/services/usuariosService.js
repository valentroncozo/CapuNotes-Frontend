// src/services/usuariosService.js
import axios from "axios";

const API_URL = "/api/usuarios";
const AUTH_URL = "/api/auth";

export const usuariosService = {
  // =======================================================
  // 1) REGISTRO DE NUEVO USUARIO
  // =======================================================
  /**
   * POST /api/auth/registro
   * Body:
   * { nombre, apellido, password, confirmacion }
   */
  registrar: async (body) => {
    try {
      const res = await axios.post(`${AUTH_URL}/registro`, body, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🟢 Usuario registrado:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error registrando usuario:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 2) LOGIN
  // =======================================================
  /**
   * POST /api/auth/login
   * Body:
   * { username, password }
   */
  login: async (body) => {
    try {
      const res = await axios.post(`${AUTH_URL}/login`, body, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🔐 Login OK:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error en login:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 3) LISTAR TODOS LOS USUARIOS
  // =======================================================
  /**
   * GET /api/usuarios
   */
  listarTodos: async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("📃 Usuarios recibidos:", res.data);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("❌ Error listando usuarios:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 4) LISTAR PENDIENTES
  // =======================================================
  /**
   * GET /api/usuarios/pendientes
   */
  listarPendientes: async () => {
    try {
      const res = await axios.get(`${API_URL}/pendientes`);
      console.log("📥 Usuarios pendientes:", res.data);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("❌ Error listando pendientes:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 5) APROBAR USUARIO
  // =======================================================
  /**
   * PUT /api/usuarios/{id}/aprobar
   * Body:
   * { rol: "COORDINADOR" | "ADMINISTRADOR" | "SUPERADMIN" }
   */
  aprobar: async (id, body) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/aprobar`, body, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🟢 Usuario aprobado:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error aprobando usuario:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 6) RECHAZAR USUARIO
  // =======================================================
  /**
   * PUT /api/usuarios/{id}/rechazar
   */
  rechazar: async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/rechazar`);
      console.log("🔴 Usuario rechazado:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error rechazando usuario:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 7) INACTIVAR USUARIO
  // =======================================================
  /**
   * PUT /api/usuarios/{id}/inactivar
   */
  inactivar: async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/inactivar`);
      console.log("⚫ Usuario inactivado:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error inactivando usuario:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 8) OBTENER ROL DE UN USUARIO
  // =======================================================
  /**
   * GET /api/usuarios/{id}/rol
   */
  obtenerRol: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}/rol`);
      console.log("🎭 Rol del usuario:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error obteniendo rol:", err?.response || err);
      throw err;
    }
  },

  // =======================================================
  // 9) ACTUALIZAR ROL
  // =======================================================
  /**
   * PUT /api/usuarios/{id}/rol
   * Body:
   * { rol: "COORDINADOR" | "ADMINISTRADOR" | "SUPERADMIN" }
   */
  actualizarRol: async (id, body) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/rol`, body, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🔄 Rol actualizado:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error actualizando rol:", err?.response || err);
      throw err;
    }
  },
};

export default usuariosService;
