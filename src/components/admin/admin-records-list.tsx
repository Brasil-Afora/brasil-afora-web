import { FaEdit, FaTrash } from "react-icons/fa"

interface AdminRecordsListItem {
  id: string
  name: string
  subtitle: string
}

interface AdminRecordsListProps {
  accentColor: "amber" | "blue"
  items: AdminRecordsListItem[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  title: string
}

const AdminRecordsList = ({
  title,
  items,
  onEdit,
  onDelete,
  accentColor,
}: AdminRecordsListProps) => {
  const titleColorClass =
    accentColor === "blue" ? "text-blue-400" : "text-amber-500"

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className={`mb-3 font-bold ${titleColorClass} text-xl`}>{title}</h2>
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            className="rounded-lg border border-slate-800 bg-slate-950 p-3"
            key={item.id}
          >
            <p className="font-semibold text-white">{item.name}</p>
            <p className="text-sm text-slate-400">{item.subtitle}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-md bg-slate-800 px-3 py-1 text-sm"
                onClick={() => onEdit(item.id)}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <FaEdit /> Editar
                </span>
              </button>
              <button
                className="rounded-md bg-red-700 px-3 py-1 text-sm text-white"
                onClick={() => onDelete(item.id)}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <FaTrash /> Excluir
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminRecordsList
