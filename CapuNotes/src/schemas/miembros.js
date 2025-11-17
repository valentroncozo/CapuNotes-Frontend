return [
  { key: "nombre", label: "Nombre", type: "text", required: true },
  { key: "apellido", label: "Apellido", type: "text", required: true },

  { key: "tipoDocumento", label: "Tipo Documento", type: "select", required: true,
    options: ["DNI","Pasaporte","Libreta Cívica"]
  },

  { key: "numeroDocumento", label: "Número Documento", type: "text", required: true },

  { key: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },

  { key: "nroTelefono", label: "Teléfono", type: "text" },

  { key: "correo", label: "Correo electrónico", type: "email" },

  { key: "carreraProfesion", label: "Carrera / Profesión", type: "text" },

  { key: "lugarOrigen", label: "Lugar de origen", type: "text" },

  { key: "instrumentoMusical", label: "Instrumento musical", type: "text" },

  {
    key: "cuerda",
    label: "Cuerda",
    type: "select",
    required: true,
    options: cuerdas.map(c => c.name),
  },

  {
    key: "area",
    label: "Área",
    type: "select",
    options: areas.map(a => a.name),
  },

  { key: "primary", label: "Guardar", type: "button" },
];
