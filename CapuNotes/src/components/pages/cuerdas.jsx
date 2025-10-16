import useCrud from "../../hooks/useCrud";
import { CuerdasService } from "../../services/cuerdas";
import CuerdasSchema from "../../schemas/cuerdas.jsx";
import EntityTableABMC from "../../components/abmc/EntityTableABMC";

export default function CuerdasPage() {
  const { items, loading, error, create, update, remove } = useCrud(CuerdasService);

  return (
    <div className="container mt-3">
      <EntityTableABMC
        schema={CuerdasSchema}
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
