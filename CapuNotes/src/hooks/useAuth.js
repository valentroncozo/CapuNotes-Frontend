// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";

/**
 * Hook centralizado de autenticación (localStorage).
 * Preparado para futura integración con Keycloak u OIDC.
 */

const AUTH_KEY = "capunotes_auth";
const USER_KEY = "capunotes_user";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem(AUTH_KEY) === "1");
  const [user, setUser] = useState(localStorage.getItem(USER_KEY) || "");

  // ---- Login local (temporal) ----
  const login = useCallback((username) => {
    localStorage.setItem(AUTH_KEY, "1");
    localStorage.setItem(USER_KEY, username);
    setUser(username);
    setIsAuthenticated(true);
  }, []);

  // ---- Logout ----
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser("");
  }, []);

  useEffect(() => {
    // Reactiva sesión persistente al recargar
    const auth = localStorage.getItem(AUTH_KEY) === "1";
    const savedUser = localStorage.getItem(USER_KEY);
    if (auth && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  return { isAuthenticated, user, login, logout };
}
