const API = {
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  areas:    "/areas",
  cuerdas:  "/cuerdas",
  miembros: "/miembros",
};
export default API;
