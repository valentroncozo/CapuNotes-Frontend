// src/hooks/useApi.js
import { useState, useEffect } from 'react';

// Hook para manejar una sola llamada a la API
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  const refetch = () => execute();

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    setData, // Para actualizar datos manualmente
  };
};

// Hook para manejar operaciones CRUD
export const useCrud = (apiService) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar todos los elementos
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.listar();
      setItems(data);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Error al cargar datos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo elemento
  const createItem = async (itemData) => {
    try {
      setError(null);
      const newItem = await apiService.crear(itemData);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Error al crear elemento';
      setError(errorMessage);
      throw err;
    }
  };

  // Actualizar elemento existente
  const updateItem = async (id, itemData) => {
    try {
      setError(null);
      const updatedItem = await apiService.actualizar(id, itemData);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al actualizar elemento';
      setError(errorMessage);
      throw err;
    }
  };

  // Eliminar elemento
  const deleteItem = async (id) => {
    try {
      setError(null);
      await apiService.eliminarPorId(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al eliminar elemento';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setItems,
    setError,
  };
};
