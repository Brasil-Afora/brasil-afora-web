import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  FaCheck,
  FaFilter,
  FaSlidersH,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa"
import type { IconType } from "react-icons/lib"

type AccentColor = "amber" | "blue"

interface AppliedFilter {
  key: string
  value: string
}

interface OpportunitiesMainLayoutProps {
  accentColor: AccentColor
  appliedFilters: AppliedFilter[]
  children: ReactNode
  error: string | null
  filterComponent: ReactNode
  icon: IconType
  isFilterActive: boolean
  loading: boolean
  mobileFilterComponent: ReactNode
  onApplyMobileFilters: () => void
  onClearFilters: () => void
  onRemoveFilter: (key: string, value: string) => void
  resultCount: number
  subtitle: string
  title: string
}

const OpportunitiesMainLayout = ({
  title,
  subtitle,
  icon: Icon,
  accentColor,
  loading,
  error,
  isFilterActive,
  resultCount,
  appliedFilters,
  onRemoveFilter,
  onClearFilters,
  onApplyMobileFilters,
  filterComponent,
  mobileFilterComponent,
  children,
}: OpportunitiesMainLayoutProps) => {
  const [showTitle, setShowTitle] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 300)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const baseTransition = "transition-all duration-500 ease-in-out transform"

  const accentClasses = {
    text: accentColor === "blue" ? "text-blue-400" : "text-amber-500",
    border: accentColor === "blue" ? "border-blue-500/20" : "border-amber-500/20",
    button:
      accentColor === "blue"
        ? "bg-blue-500 hover:bg-blue-600 text-white"
        : "bg-amber-500 hover:bg-amber-600 text-black",
    hoverText: accentColor === "blue" ? "hover:text-blue-400" : "hover:text-amber-500",
  }

  const handleToggleFilterSidebar = () => {
    setShowFilter((prev) => !prev)
  }

  const handleApplyFilters = () => {
    onApplyMobileFilters()
    setShowFilter(false)
  }

  const handleClearAllFilters = () => {
    onClearFilters()
    setShowFilter(false)
  }

  const renderAppliedFilters = () => (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white">
      {appliedFilters.map((filter) => (
        <span
          className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-white"
          key={`${filter.key}-${filter.value}`}
        >
          {filter.value}
          <button
            className="text-white opacity-70 transition-opacity hover:opacity-100"
            onClick={() => onRemoveFilter(filter.key, filter.value)}
            type="button"
          >
            <FaTimesCircle className="ml-1" />
          </button>
        </span>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-white/60">Carregando oportunidades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 font-inter text-white">
      {!isFilterActive && (
        <div
          className={`px-8 pt-10 pb-6 text-center ${baseTransition} ${showTitle ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <Icon className={`text-3xl ${accentClasses.text}`} />
            <h1 className={`font-bold text-3xl ${accentClasses.text}`}>{title}</h1>
          </div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/50">{subtitle}</p>
        </div>
      )}

      {showFilter && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 md:hidden">
          <div className="max-h-[90vh] w-11/12 overflow-y-auto rounded-lg bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`font-bold ${accentClasses.text} text-lg`}>Filtros</h2>
              <button
                className={`text-white ${accentClasses.hoverText}`}
                onClick={handleToggleFilterSidebar}
                type="button"
              >
                <FaTimes size={24} />
              </button>
            </div>
            {mobileFilterComponent}
            <div className="mt-4 flex gap-2">
              <button
                className={`w-full rounded-lg ${accentClasses.button} py-2 font-semibold transition-colors`}
                onClick={handleApplyFilters}
                type="button"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaCheck /> Aplicar Filtros
                </span>
              </button>
              <button
                className="w-full rounded-lg bg-red-500 py-2 font-semibold text-white transition-colors hover:bg-red-600"
                onClick={handleClearAllFilters}
                type="button"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaTimes /> Limpar Filtros
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 px-6 md:flex-row">
        <div
          className={`hidden md:block md:w-1/4 ${baseTransition} ${showContent ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          <div
            className={`sticky top-24 rounded-lg border ${accentClasses.border} bg-slate-900 p-6 shadow-lg`}
          >
            <div className={`mb-4 flex items-center font-bold ${accentClasses.text} text-lg`}>
              <FaFilter className={`mr-2 ${accentClasses.text}`} />
              Filtros
            </div>
            {filterComponent}
          </div>
        </div>

        <div
          className={`md:w-3/4 ${baseTransition} ${showContent ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="font-semibold text-lg text-white">
              {`Exibindo ${resultCount} oportunidades`}
            </p>
            <div className="mt-4 w-full md:hidden">
              <button
                className={`flex w-full items-center justify-center gap-2 rounded-lg ${accentClasses.button} py-2 font-semibold transition-colors`}
                onClick={handleToggleFilterSidebar}
                type="button"
              >
                <FaSlidersH /> Abrir Filtros
              </button>
            </div>
            {renderAppliedFilters()}
          </div>

          {resultCount > 0 ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <img
                alt="Logo Global Passport"
                className="mb-4 h-20 w-auto object-contain opacity-80"
                height={80}
                src="/logo.png"
                width={80}
              />
              <h3 className="mb-2 font-bold text-2xl text-white">
                Nenhuma oportunidade encontrada
              </h3>
              <p className="mb-6 text-sm text-white/60">
                Tente ajustar seus filtros para ver mais resultados.
              </p>
              <button
                className={`rounded-full ${accentClasses.button} px-6 py-2 font-bold transition-colors duration-300`}
                onClick={handleClearAllFilters}
                type="button"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OpportunitiesMainLayout
export type { AppliedFilter }
