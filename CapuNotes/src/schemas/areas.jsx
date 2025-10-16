const AreasSchema = {
  entity: "Área",
  columns: [
    { key: "nombre", label: "Nombre *", required: true },
    { key: "responsable", label: "Responsable" },
  ],
  form: [
    { key: "nombre", label: "Nombre *", required: true, type: "text" },
    { key: "responsable", label: "Responsable", type: "text" },
  ],
};

export default AreasSchema;
