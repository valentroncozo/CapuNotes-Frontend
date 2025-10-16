const CuerdasSchema = {
  entity: "Cuerda",
  columns: [
    { key: "nombre", label: "Nombre *", required: true },
  ],
  form: [
    { key: "nombre", label: "Nombre *", required: true, type: "text" },
  ],
};

export default CuerdasSchema;
