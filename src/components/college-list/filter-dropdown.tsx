import type { ReactNode } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

interface FilterDropdownProps {
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  placeholder: string
  title: string
}

const FilterDropdown = ({
  title,
  placeholder,
  onToggle,
  isOpen,
  children,
}: FilterDropdownProps) => (
  <div className="w-full">
    <label className="mb-1 block text-sm text-white" htmlFor={title}>
      <span className="text-amber-500">{title}</span>
    </label>
    <div className="relative w-full">
      <button
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-slate-900 bg-slate-950 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        onClick={onToggle}
        type="button"
      >
        <span>{placeholder}</span>
        {isOpen ? (
          <FaChevronUp className="ml-2" />
        ) : (
          <FaChevronDown className="ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="absolute left-0 z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-950 bg-slate-900 p-3 shadow-xl">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {children}
          </div>
        </div>
      )}
    </div>
  </div>
)

export default FilterDropdown
