type AdminTab = "internacional" | "nacional"

interface AdminTabsProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  return (
    <div className="mb-4 flex gap-2">
      <button
        className={`rounded-lg px-4 py-2 font-semibold ${activeTab === "internacional" ? "bg-blue-500 text-white" : "bg-slate-900 text-slate-200"}`}
        onClick={() => onTabChange("internacional")}
        type="button"
      >
        Internacionais
      </button>
      <button
        className={`rounded-lg px-4 py-2 font-semibold ${activeTab === "nacional" ? "bg-amber-500 text-black" : "bg-slate-900 text-slate-200"}`}
        onClick={() => onTabChange("nacional")}
        type="button"
      >
        Nacionais
      </button>
    </div>
  )
}

export default AdminTabs
export type { AdminTab }
