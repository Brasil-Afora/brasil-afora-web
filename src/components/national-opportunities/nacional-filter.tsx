import type { Dispatch, SetStateAction } from "react"
import { useEffect, useRef, useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import type { OpportunitiesFiltros } from "./types"

interface NacionalFilterProps {
  filtros: OpportunitiesFiltros
  filtrosIniciais: OpportunitiesFiltros
  setFiltros: Dispatch<SetStateAction<OpportunitiesFiltros>>
}

const niveisEnsinoOptions = [
  "Ano Sabático",
  "Doutorado",
  "Ensino Médio",
  "Graduação",
  "MBA",
  "Mestrado",
  "Pós-Doutorado",
].sort()

const tiposProgramaOptions = [
  "Olimpíadas",
  "Feiras de Ciências",
  "Programas de Liderança",
  "Iniciação Científica",
  "Simulações da ONU",
  "Cursos & Imersões",
  "Programas de Mentoria",
  "Voluntariado/Social",
]

const taxaAplicacaoOptions = ["Gratuito", "Pago"].sort()
const modalidadeOptions = ["Presencial", "Online", "Híbrido"]

const NacionalFilter = ({
  filtros,
  setFiltros,
  filtrosIniciais,
}: NacionalFilterProps) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCheckboxChange = (
    id: keyof OpportunitiesFiltros,
    value: string
  ) => {
    const currentArray = (filtros[id] as string[]) || []
    if (currentArray.includes(value)) {
      setFiltros((prev) => ({
        ...prev,
        [id]: currentArray.filter((item) => item !== value),
      }))
    } else {
      setFiltros((prev) => ({ ...prev, [id]: [...currentArray, value] }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFiltros((prev) => ({ ...prev, [id]: value }))
  }

  const isFilterActive = () =>
    filtros.idade !== "" ||
    filtros.nivelEnsino.length > 0 ||
    filtros.tipo.length > 0 ||
    filtros.taxaAplicacao.length > 0 ||
    filtros.modalidade.length > 0

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName)
  }

  const getPlaceholder = (
    filterKey: keyof OpportunitiesFiltros,
    defaultLabel: string
  ): string => {
    const arr = filtros[filterKey] as string[]
    if (!arr || arr.length === 0) {
      return defaultLabel
    }
    if (arr.length === 1) {
      return arr[0]
    }
    return `${arr.length} selecionados`
  }

  const inputClasses =
    "p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 w-full text-sm"
  const dropdownButtonClasses =
    "p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 w-full flex justify-between items-center cursor-pointer text-sm"
  const dropdownMenuClasses =
    "absolute mt-2 left-0 z-20 w-full max-h-60 overflow-y-auto bg-slate-900 rounded-lg shadow-xl p-3 border border-slate-950 text-white"
  const checkboxClasses =
    "rounded text-amber-500 bg-slate-950 border-slate-900 focus:ring-amber-500"

  const renderDropdown = (
    key: keyof OpportunitiesFiltros,
    label: string,
    placeholder: string,
    options: string[],
    cols: 1 | 2 = 1
  ) => (
    <div className="relative w-full">
      <p className="mb-1 block text-white text-xs">
        <span className="text-amber-500">{label}</span>
      </p>
      <button
        className={dropdownButtonClasses}
        onClick={() => toggleFilter(key)}
        type="button"
      >
        <span>{getPlaceholder(key, placeholder)}</span>
        {openFilter === key ? (
          <FaChevronUp className="ml-2" />
        ) : (
          <FaChevronDown className="ml-2" />
        )}
      </button>
      {openFilter === key && (
        <div className={dropdownMenuClasses}>
          <div
            className={`grid gap-2 ${cols === 2 ? "grid-cols-2" : "flex flex-col"}`}
          >
            {options.map((opt) => (
              <label
                className="flex cursor-pointer items-center space-x-2 text-sm"
                key={opt}
              >
                <input
                  checked={(filtros[key] as string[]).includes(opt)}
                  className={checkboxClasses}
                  onChange={() => handleCheckboxChange(key, opt)}
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

  return (
    <div className="flex flex-col gap-2 font-inter" ref={filterRef}>
      {renderDropdown(
        "tipo",
        "Tipo de Programa",
        "Qualquer programa",
        tiposProgramaOptions,
        2
      )}
      {renderDropdown(
        "nivelEnsino",
        "Nível de Ensino",
        "Qualquer nível",
        niveisEnsinoOptions
      )}

      {renderDropdown(
        "taxaAplicacao",
        "Taxa de Aplicação",
        "Qualquer taxa",
        taxaAplicacaoOptions
      )}
      {renderDropdown(
        "modalidade",
        "Modalidade",
        "Qualquer modalidade",
        modalidadeOptions
      )}

      <div className="w-full">
        <label className="mb-1 block text-white text-xs" htmlFor="idade">
          <span className="text-amber-500">Sua idade</span>
        </label>
        <input
          className={inputClasses}
          id="idade"
          onChange={handleInputChange}
          placeholder="Ex: 18"
          type="number"
          value={filtros.idade}
        />
      </div>

      <div className="mt-2 hidden md:block">
        <button
          className={`w-full rounded-lg py-2 font-semibold text-sm transition-colors duration-200 ${isFilterActive() ? "bg-amber-500 text-black hover:bg-amber-600" : "cursor-not-allowed bg-slate-900 text-slate-500"}`}
          disabled={!isFilterActive()}
          onClick={() => setFiltros(filtrosIniciais)}
          type="button"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}

export default NacionalFilter
