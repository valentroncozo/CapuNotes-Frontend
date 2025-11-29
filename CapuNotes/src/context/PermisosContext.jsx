import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PermisosContext = createContext({ permisos: [], setPermisos: () => {} });

export function PermisosProvider({ children }) {
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    axios.get("/usuarios/permisos")
      .then(res => setPermisos(res.data))
      .catch(() => setPermisos([]));
  }, []);

  return (
    <PermisosContext.Provider value={{ permisos, setPermisos }}>
      {children}
    </PermisosContext.Provider>
  );
}

export function usePermisos() {
  return useContext(PermisosContext);
}
