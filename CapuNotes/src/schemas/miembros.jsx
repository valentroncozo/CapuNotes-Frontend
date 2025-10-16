// Factory porque necesita inyectar las opciones de select (cuerdas)
function MiembrosSchema(cuerdasOptions = []) {
  return {
    entity: "Miembro",
    columns: [
      { key: "nombre", label: "Nombre *", required: true },
      { key: "apellido", label: "Apellido *", required: true },
      // Mostramos el nombre de la cuerda (ajustá a la forma real si difiere)
      { key: "cuerdaNombre", label: "Cuerda *", required: true },
    ],
    form: [
      { key: "nombre", label: "Nombre *", required: true, type: "text" },
      { key: "apellido", label: "Apellido *", required: true, type: "text" },
      {
        key: "cuerdaId",
        label: "Cuerda *",
        required: true,
        type: "select",
        options: cuerdasOptions, // [{ value, label }]
      },
    ],
  };
}

export default MiembrosSchema;
