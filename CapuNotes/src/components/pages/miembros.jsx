import useCrud from "../../hooks/useCrud";
import { MiembrosService } from "../../services/miembros";
import { CuerdasService } from "../../services/cuerdas";
import MiembrosSchemaFactory from "../../schemas/miembros.jsx";
import EntityTableABMC from "../../components/abmc/EntityTableABMC";
import { useEffect, useMemo, useState } from "react";

export default function MiembrosPage() {
  const miembrosCrud = useCrud(MiembrosService);
  const cuerdasCrud = useCrud(CuerdasService);
  const [schema, setSchema] = useState(MiembrosSchemaFactory([]));

  // Cuando cargan las cuerdas, armamos las opciones del select
  const cuerdaOptions = useMemo(() => {
    return (cuerdasCrud.items || []).map(c => ({
      value: c.id ?? c._id ?? c.value ?? c.nombre, // intenta cubrir mocks/real
      label: c.nombre ?? c.label ?? "",
    }));
  }, [cuerdasCrud.items]);

  useEffect(() => {
    setSchema(MiembrosSchemaFactory(cuerdaOptions));
  }, [cuerdaOptions]);

  return (
    <div className="container mt-3">
      <EntityTableABMC
        schema={schema}
        data={miembrosCrud.items}
        loading={miembrosCrud.loading || cuerdasCrud.loading}
        error={miembrosCrud.error || cuerdasCrud.error}
        onCreate={miembrosCrud.create}
        onUpdate={miembrosCrud.update}
        onDelete={miembrosCrud.remove}
      />
    </div>
  );
}
