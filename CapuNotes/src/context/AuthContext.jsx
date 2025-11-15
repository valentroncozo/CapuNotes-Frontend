import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/services/apiClient";
import { postBroadcast, subscribeBroadcast, STORAGE_FALLBACK_KEY } from "@/utils/broadcast";

const getCookie = (name) => {
  if (typeof document === "undefined") return undefined;
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === name) {
      return rest.join("=");
    }
  }
  return undefined;
};

// crear el contexto sin valor por defecto y validar su uso
const AuthContext = createContext(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate(); // <- usado para redirecciones a /401 /403
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // { changed code }
  // centralizar almacenamiento y broadcasting entre pestañas
  const LOCAL_KEY = "capunotes_user";
  const initializedRef = useRef(false); // { changed code }
  const refreshPromiseRef = useRef(null); // controlar refresh concurrente
  const csrfProbeDisabledRef = useRef(false); // evita reintentos ruidosos si /csrf no existe

  const setUserFromMe = (me, { broadcast = true } = {}) => {
    const normalizedUser = me || null;
    const rawPermissions =
      (Array.isArray(normalizedUser?.permissions) && normalizedUser.permissions) ||
      (Array.isArray(normalizedUser?.permissions_list) && normalizedUser.permissions_list) ||
      (Array.isArray(normalizedUser?.authorities) && normalizedUser.authorities) ||
      [];
    const nextPermissions = rawPermissions;

    setUser(normalizedUser);
    setPermissions(nextPermissions);
    setIsAuthenticated(!!normalizedUser);

    if (normalizedUser) {
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(normalizedUser)); } catch (e) { /* ignore */ }
      if (broadcast) {
        postBroadcast({ type: "login", user: normalizedUser });
      }
    } else {
      try { localStorage.removeItem(LOCAL_KEY); } catch (e) { /* ignore */ }
      if (broadcast) {
        postBroadcast({ type: "logout" });
      }
    }

    return !!normalizedUser;
  };

  // intento de refresh centralizado con bloqueo
  const doRefresh = useCallback(async () => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;
    const p = (async () => {
      try {
        await apiClient.post("/api/auth/refresh");
        return true;
      } catch (e) {
        return false;
      } finally {
          refreshPromiseRef.current = null;
      }
    })();
    refreshPromiseRef.current = p;
    return p;
  }, []);

  const getMe = useCallback(async () => {
    try {
  const data = await apiClient.get("/api/auth/me");
      console.log("getMe exitoso:", data);
      return setUserFromMe(data, { broadcast: false });
    } catch (err) {
        const status = err?.response?.status ?? err?.status;
      console.warn("getMe fallo:", { status, message: err?.message, response: err?.details ?? err?.response });
      // Si 401: intentar un refresh controlado y reintentar GET /me una vez
      if (status === 401) {
        const refreshed = await doRefresh();
        if (!refreshed) {
          // no borrar cache del user; devolver false para que el handler de eventos decida navegación
          return false;
        }
        try {
          const data2 = await apiClient.get("/api/auth/me");
          console.log("getMe tras refresh exitoso:", data2);
          return setUserFromMe(data2, { broadcast: false });
        } catch (err2) {
            console.warn("getMe tras refresh fallo:", err2);
          return false;
        }
      }
      // otros errores: no borrar el cache aquí (evitar loops); dejar que quien llame maneje
      return false;
    }
  }, [doRefresh]);

  const refresh = useCallback(async () => {
    try {
  await apiClient.post("/api/auth/refresh");
      await getMe();
      return true;
    } catch (err) {
      return false;
    }
  }, [getMe]);

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
  const loginResponse = await apiClient.post("/api/auth/login", { body: { username, password } });
        
        console.log("🍪 TODAS las cookies después del login:", document.cookie);
        console.log("📦 Login response:", loginResponse);
        
        // Intentar obtener CSRF token desde la respuesta del login si viene en headers
        // Algunos backends devuelven el token en un header custom
        
        // Forzar generación/lectura de CSRF token
        let xsrf = getCookie("XSRF-TOKEN");
        console.log("🔍 Buscando XSRF-TOKEN en cookies:", xsrf);
        
        if (!xsrf) {
          if (!csrfProbeDisabledRef.current) {
            console.warn("⚠️ XSRF-TOKEN no encontrada en cookies, llamando /api/auth/csrf...");
            try {
              const csrfResponse = await apiClient.get("/api/auth/csrf", { suppressErrorLog: true });
              console.log("📦 CSRF response:", csrfResponse);
              console.log("🍪 Cookies después de /api/auth/csrf:", document.cookie);
              xsrf = getCookie("XSRF-TOKEN");

              // Si TODAVÍA no está en cookies, intentar extraerla de la respuesta
              if (!xsrf && csrfResponse && csrfResponse.token) {
                xsrf = csrfResponse.token;
                console.log("✅ XSRF-TOKEN obtenida desde respuesta de /api/auth/csrf:", xsrf);
              } else if (xsrf) {
                console.log("✅ XSRF-TOKEN obtenida desde cookies después de /api/auth/csrf:", xsrf);
              } else {
                console.error("❌ XSRF-TOKEN no disponible ni en cookies ni en respuesta");
              }
            } catch (csrfErr) {
              csrfProbeDisabledRef.current = true;
              const status = csrfErr?.response?.status;
              console.warn("⚠️ /api/auth/csrf no disponible, omitiendo futuros intentos", { status, message: csrfErr?.message });
              // continuar con el flujo: algunos backends no exponen este endpoint
            }
          } else {
            console.warn("⚠️ Saltando llamada a /api/auth/csrf porque fue marcada como indisponible en intentos previos");
          }
        } else {
          console.log("✅ XSRF-TOKEN presente en cookies después del login:", xsrf);
        }
        
        // obtener /me y setear estado (broadcast verdadero por defecto)
        const meSuccess = await getMe();
        setLoading(false);
        
        if (!meSuccess) {
          console.error("❌ Login exitoso pero getMe() falló - estado inconsistente");
          throw new Error("Failed to load user data after login");
        }
        
        console.log("✅ Login completo - usuario autenticado:", user);
        return true;
      } catch (err) {
        setLoading(false);
        throw err;
      }
    },
    [getMe]
  );

  const logout = useCallback(async () => {
    try {
        await apiClient.post("/api/auth/logout");
    } catch (err) {
      // ignore errors contacting backend
    } finally {
      setUserFromMe(null, { broadcast: true });
      setPermissions([]);
      setIsAuthenticated(false);
    }
  }, []);

  // helper para reintentar una petición protegida tras refresh si recibe 401
  // { changed code }
  // Inicializar desde localStorage y sincronizar entre pestañas
  useEffect(() => {
    if (initializedRef.current) return; // evitar llamadas repetidas (StrictMode / remounts)
    initializedRef.current = true;

    // cargar cache inmediato para evitar parpadeo en UI
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        setUserFromMe(cached, { broadcast: false });
      }
    } catch (e) { /* ignore parse errors */ }

    // validar con backend y actualizar estado real (no bloqueante)
    (async () => {
      try {
        await getMe();
      } finally {
        setLoading(false);
      }
    })();

    // BroadcastChannel + fallback via storage (suscripción centralizada en utils)
    let bcUnsub = () => {};
    try {
      bcUnsub = subscribeBroadcast((msg) => {
        if (!msg) return;
        if (msg.type === "logout") setUserFromMe(null, { broadcast: false });
        else if (msg.type === "login" && msg.user) setUserFromMe(msg.user, { broadcast: false });
      });
    } catch (e) { /* ignore */ }

    const onStorage = (e) => {
      if (!e) return;
      if (e.key === LOCAL_KEY) {
        if (!e.newValue) setUserFromMe(null, { broadcast: false });
        else {
          try { setUserFromMe(JSON.parse(e.newValue), { broadcast: false }); } catch (er) {}
        }
      } else if (e.key === STORAGE_FALLBACK_KEY || e.key === LOCAL_KEY + "_signal") {
        try {
          const raw = localStorage.getItem(LOCAL_KEY);
          if (!raw) setUserFromMe(null, { broadcast: false });
          else setUserFromMe(JSON.parse(raw), { broadcast: false });
        } catch (er) {}
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      try { bcUnsub(); } catch (e) {}
      window.removeEventListener("storage", onStorage);
    };
  }, [getMe, subscribeBroadcast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isAuthenticated,
        loading,
        login,
        logout,
        refresh,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}