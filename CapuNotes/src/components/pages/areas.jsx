import useCrud from "../../hooks/useCrud";
import { AreasService } from "../../services/areas";
import AreasSchema from "../../schemas/areas.jsx";
import EntityTableABMC from "../../components/abmc/EntityTableABMC";

export default function AreasPage() {
  const { items, loading, error, create, update, remove } = useCrud(AreasService);

  return (
    <div className="container mt-3">
      <EntityTableABMC
        schema={AreasSchema}
        data={items}
        loading={loading}
        error={error}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  );
}
