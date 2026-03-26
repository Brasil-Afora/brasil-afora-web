import { useRef, useState } from "react"
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa"
import useClickOutside from "../../hooks/use-click-outside"

type AccentColor = "amber" | "blue"

interface FilterDropdownProps {
  accentColor?: AccentColor
  cols?: 1 | 2
  label: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  searchable?: boolean
  searchPlaceholder?: string
  selected: string[]
}

const getAccentClasses = (color: AccentColor) => ({
  label: color === "blue" ? "text-blue-400" : "text-amber-500",
  focus: color === "blue" ? "focus:ring-blue-500" : "focus:ring-amber-500",
  checkbox:
    color === "blue"
      ? "text-blue-500 focus:ring-blue-500"
      : "text-amber-500 focus:ring-amber-500",
})

const FilterDropdown = ({
  label,
  placeholder,
  options,
  selected,
  onChange,
  cols = 1,
  accentColor = "blue",
  searchable = false,
  searchPlaceholder = "Pesquisar...",
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => {
    setIsOpen(false)
    setSearchTerm("")
  })

  const accent = getAccentClasses(accentColor)

  const getDisplayText = (): string => {
    if (selected.length === 0) {
      return placeholder
    }
    if (selected.length === 1) {
      return selected[0]
    }
    return `${selected.length} selecionados`
  }

  const filteredOptions = searchable
    ? options.filter((opt) =>
      opt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : options

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setSearchTerm("")
    }
  }

  const inputClasses = `p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 ${accent.focus} h-10 w-full text-sm`
  const dropdownButtonClasses = `p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 ${accent.focus} h-10 w-full flex justify-between items-center cursor-pointer text-sm`
  const dropdownMenuClasses =
    "absolute mt-2 left-0 z-20 w-full max-h-60 overflow-y-auto bg-slate-900 rounded-lg shadow-xl p-3 border border-slate-950 text-white"
  const checkboxClasses = `rounded ${accent.checkbox} bg-slate-950 border-slate-900`

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <p className="mb-1 block text-white text-xs">
        <span className={accent.label}>{label}</span>
      </p>
      <button
        className={dropdownButtonClasses}
        onClick={handleToggle}
        type="button"
      >
        <span>{getDisplayText()}</span>
        {isOpen ? (
          <FaChevronUp className="ml-2" />
        ) : (
          <FaChevronDown className="ml-2" />
        )}
      </button>
      {isOpen && (
        <div className={dropdownMenuClasses}>
          {searchable && (
            <div className="sticky top-0 mb-2 rounded-md bg-slate-950 p-2">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-white text-xs text-opacity-50" />
                <input
                  className="w-full rounded bg-slate-900 p-2 pl-10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  type="text"
                  value={searchTerm}
                />
              </div>
            </div>
          )}
          <div
            className={`grid gap-2 ${cols === 2 ? "grid-cols-2" : "flex flex-col"}`}
          >
            {filteredOptions.map((opt) => (
              <label
                className="flex cursor-pointer items-center space-x-2 text-sm"
                key={opt}
              >
                <input
                  checked={selected.includes(opt)}
                  className={checkboxClasses}
                  onChange={() => onChange(opt)}
                  type="checkbox"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
