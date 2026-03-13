import type { Dispatch, SetStateAction } from "react"
import { useEffect, useRef, useState } from "react"
import FilterCheckbox from "./filter-checkbox"
import FilterDropdown from "./filter-dropdown"
import type { CollegeFiltros } from "./types"

interface EstadoData {
  abbr: string
  nome: string
}

const estadosData: EstadoData[] = [
  { abbr: "MA", nome: "Massachusetts" },
  { abbr: "CT", nome: "Connecticut" },
  { abbr: "CA", nome: "Califórnia" },
  { abbr: "NH", nome: "New Hampshire" },
  { abbr: "RI", nome: "Rhode Island" },
  { abbr: "NY", nome: "Nova York" },
  { abbr: "TX", nome: "Texas" },
  { abbr: "TN", nome: "Tennessee" },
  { abbr: "PA", nome: "Pensilvânia" },
  { abbr: "NC", nome: "Carolina do Norte" },
  { abbr: "IL", nome: "Illinois" },
  { abbr: "MD", nome: "Maryland" },
  { abbr: "FL", nome: "Flórida" },
  { abbr: "WA", nome: "Washington" },
  { abbr: "VT", nome: "Vermont" },
  { abbr: "ME", nome: "Maine" },
  { abbr: "OH", nome: "Ohio" },
  { abbr: "MN", nome: "Minnesota" },
  { abbr: "UT", nome: "Utah" },
  { abbr: "NJ", nome: "Nova Jersey" },
  { abbr: "CO", nome: "Colorado" },
  { abbr: "IN", nome: "Indiana" },
  { abbr: "ID", nome: "Idaho" },
  { abbr: "MO", nome: "Missouri" },
]

const testesProficiencia = ["TOEFL", "IELTS", "Duolingo English Test"]
const politicasFinanceiras = ["need-blind", "need-based", "merit-based"]

interface CollegeFilterProps {
  filtros: CollegeFiltros
  onClearFilters: () => void
  setFiltros: Dispatch<SetStateAction<CollegeFiltros>>
}

const CollegeFilter = ({
  filtros,
  setFiltros,
  onClearFilters,
}: CollegeFilterProps) => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCheckboxChange = (id: keyof CollegeFiltros, value: string) => {
    setFiltros((prev) => {
      const currentArray = (prev[id] as string[]) || []
      if (currentArray.includes(value)) {
        return { ...prev, [id]: currentArray.filter((item) => item !== value) }
      }
      return { ...prev, [id]: [...currentArray, value] }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    let newId = id
    if (id === "faixaSAT") {
      newId = "notaSAT"
    } else if (id === "faixaACT") {
      newId = "notaACT"
    }
    setFiltros((prev) => ({ ...prev, [newId]: value }))
  }

  const isFilterActive = () =>
    Object.values(filtros).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== ""
    )

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName)
  }

  const getEstadoPlaceholder = () => {
    const count = filtros.estado.length
    if (count === 0) {
      return "Todos os estados"
    }
    if (count === 1) {
      return (
        estadosData.find((e) => e.abbr === filtros.estado[0])?.nome ||
        filtros.estado[0]
      )
    }
    return `${count} estados selecionados`
  }

  const getTestesProficienciaPlaceholder = () => {
    const count = filtros.testesProficiencia.length
    if (count === 0) {
      return "Todos os testes"
    }
    if (count === 1) {
      return filtros.testesProficiencia[0]
    }
    return `${count} testes selecionados`
  }

  const getPoliticasFinanceirasPlaceholder = () => {
    const count = filtros.politicaFinanceira.length
    if (count === 0) {
      return "Todas as políticas"
    }
    if (count === 1) {
      return filtros.politicaFinanceira[0]
    }
    return `${count} políticas selecionadas`
  }

  const inputClasses =
    "p-3 rounded-md bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 text-sm"

  return (
    <div className="flex flex-col gap-4 font-inter" ref={filterRef}>
      <FilterDropdown
        isOpen={openFilter === "estado"}
        onToggle={() => toggleFilter("estado")}
        placeholder={getEstadoPlaceholder()}
        title="Estado"
      >
        {[...estadosData]
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .map((e) => (
            <FilterCheckbox
              isChecked={filtros.estado.includes(e.abbr)}
              key={e.abbr}
              onChange={() => handleCheckboxChange("estado", e.abbr)}
              value={e.nome}
            />
          ))}
      </FilterDropdown>

      <div className="w-full">
        <label
          className="mb-1 block text-sm text-white"
          htmlFor="taxaAceitacao"
        >
          <span className="text-amber-500">Taxa de Aceitação Mínima (%)</span>
        </label>
        <input
          className={`${inputClasses} w-full`}
          id="taxaAceitacao"
          onChange={handleInputChange}
          placeholder="Ex: 10"
          type="number"
          value={filtros.taxaAceitacao}
        />
      </div>

      <div className="w-full">
        <label className="mb-1 block text-sm text-white" htmlFor="notaSAT">
          <span className="text-amber-500">Nota do SAT</span>
        </label>
        <input
          className={`${inputClasses} w-full`}
          id="notaSAT"
          onChange={handleInputChange}
          placeholder="Ex: 1500"
          type="number"
          value={filtros.notaSAT}
        />
      </div>

      <div className="w-full">
        <label className="mb-1 block text-sm text-white" htmlFor="notaACT">
          <span className="text-amber-500">Nota do ACT</span>
        </label>
        <input
          className={`${inputClasses} w-full`}
          id="notaACT"
          onChange={handleInputChange}
          placeholder="Ex: 33"
          type="number"
          value={filtros.notaACT}
        />
      </div>

      <FilterDropdown
        isOpen={openFilter === "testesProficiencia"}
        onToggle={() => toggleFilter("testesProficiencia")}
        placeholder={getTestesProficienciaPlaceholder()}
        title="Testes de Proficiência"
      >
        {[...testesProficiencia].sort().map((t) => (
          <FilterCheckbox
            isChecked={filtros.testesProficiencia.includes(t)}
            key={t}
            onChange={() => handleCheckboxChange("testesProficiencia", t)}
            value={t}
          />
        ))}
      </FilterDropdown>

      <FilterDropdown
        isOpen={openFilter === "politicaFinanceira"}
        onToggle={() => toggleFilter("politicaFinanceira")}
        placeholder={getPoliticasFinanceirasPlaceholder()}
        title="Política Financeira"
      >
        {[...politicasFinanceiras].sort().map((p) => (
          <FilterCheckbox
            isChecked={filtros.politicaFinanceira.includes(p)}
            key={p}
            onChange={() => handleCheckboxChange("politicaFinanceira", p)}
            value={p}
          />
        ))}
      </FilterDropdown>

      <div className="mt-2 hidden md:block">
        <button
          className={`w-full rounded-lg py-2 font-semibold transition-colors duration-200 ${isFilterActive() ? "bg-amber-500 text-black hover:bg-amber-600" : "cursor-not-allowed bg-slate-900 text-slate-500"}`}
          disabled={!isFilterActive()}
          onClick={onClearFilters}
          type="button"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}

export default CollegeFilter
