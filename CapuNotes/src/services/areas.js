// src/services/areas.js
import api from './api';

const AREAS_ENDPOINT = '/areas';

export const listar = async () => {
  try {
    const response = await api.get(AREAS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al listar áreas:', error);
    throw error;
  }
};

export const obtenerPorId = async (id) => {
  try {
    const response = await api.get(`${AREAS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener área:', error);
    throw error;
  }
};

export const crear = async (areaData) => {
  try {
    const response = await api.post(AREAS_ENDPOINT, areaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear área:', error);
    throw error;
  }
};

export const actualizar = async (id, areaData) => {
  try {
    const response = await api.put(`${AREAS_ENDPOINT}/${id}`, areaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar área:', error);
    throw error;
  }
};

export const eliminarPorId = async (id) => {
  try {
    await api.delete(`${AREAS_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar área:', error);
    throw error;
  }
};

// Funciones adicionales específicas para áreas
export const buscar = async (termino) => {
  try {
    const response = await api.get(
      `${AREAS_ENDPOINT}/buscar?q=${encodeURIComponent(termino)}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al buscar áreas:', error);
    throw error;
  }
};

export const obtenerMiembrosPorArea = async (areaId) => {
  try {
    const response = await api.get(`${AREAS_ENDPOINT}/${areaId}/miembros`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener miembros del área:', error);
    throw error;
  }
};
