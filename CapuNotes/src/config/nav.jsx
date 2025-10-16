// src/config/nav.js
const nav = [
  { id: "inicio", type: "link", label: "Inicio", to: "/principal" },
  {
    id: "org",
    type: "group",
    label: "Organización del Coro",
    items: [
      { label: "Cuerdas", to: "/cuerdas" },
      { label: "Áreas", to: "/organizacion-coro" },
      { label: "Miembros", to: "/miembros" },
    ],
  },
  { id: "asist", type: "link", label: "Asistencias", to: "/asistencias" },
  { id: "aud", type: "link", label: "Audiciones", to: "/audiciones" },
  { id: "songs", type: "link", label: "Canciones", to: "/canciones" },
  { id: "ev", type: "link", label: "Eventos", to: "/eventos" },
  { id: "frat", type: "link", label: "Fraternidades", to: "/fraternidades" },
  { id: "users", type: "link", label: "Usuarios y roles", to: "/usuarios-roles" },
];

export default nav;
