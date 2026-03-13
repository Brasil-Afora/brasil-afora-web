import { useEffect, useRef, useState } from "react"
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa"
import useSessionStorage from "../../hooks/use-session-storage"
import { universidades as universidadesOriginais } from "../../utils/college-data"
import CollegeFilter from "./college-filter"
import CollegeList from "./college-list"
import type { CollegeFiltros, University } from "./types"

const estadosData = [
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

const getEstadoNome = (abbr: string): string => {
  const estado = estadosData.find((e) => e.abbr === abbr)
  return estado ? estado.nome : abbr
}

const applyFilters = (
  data: University[],
  filtros: CollegeFiltros
): University[] => {
  let result = data

  if (filtros.nome) {
    result = result.filter((uni) =>
      uni.nome.toLowerCase().includes(filtros.nome.toLowerCase().trim())
    )
  }
  if (filtros.estado.length > 0) {
    result = result.filter((uni) => filtros.estado.includes(uni.estado))
  }
  if (filtros.taxaAceitacao) {
    const taxaInput = Number(filtros.taxaAceitacao)
    if (!Number.isNaN(taxaInput)) {
      result = result.filter((uni) => {
        const taxaUni = Number(uni.taxaAceitacao.replace("%", ""))
        return taxaUni >= taxaInput
      })
    }
  }
  if (filtros.notaSAT) {
    const satInput = Number(filtros.notaSAT)
    if (!Number.isNaN(satInput)) {
      result = result.filter((uni) => {
        const satUni = uni.faixaSAT.split("-").map(Number)
        return satUni.length === 2
          ? satInput >= satUni[0] && satInput <= satUni[1]
          : false
      })
    }
  }
  if (filtros.notaACT) {
    const actInput = Number(filtros.notaACT)
    if (!Number.isNaN(actInput)) {
      result = result.filter((uni) => {
        const actUni = uni.faixaACT.split("-").map(Number)
        return actUni.length === 2
          ? actInput >= actUni[0] && actInput <= actUni[1]
          : false
      })
    }
  }
  if (filtros.testesProficiencia.length > 0) {
    result = result.filter((uni) => {
      const testesUni = uni.testesProficiencia.split(", ")
      return filtros.testesProficiencia.every((test) =>
        testesUni.includes(test)
      )
    })
  }
  if (filtros.politicaFinanceira.length > 0) {
    result = result.filter((uni) =>
      filtros.politicaFinanceira.includes(uni.politicaFinanceira)
    )
  }
  if (filtros.majorsPrincipais.length > 0) {
    result = result.filter((uni) => {
      const majorsUni = uni.majorsPrincipais.split(", ")
      return filtros.majorsPrincipais.some((major) => majorsUni.includes(major))
    })
  }
  return result
}

const sortUniversities = (
  data: University[],
  criteria: SortCriteria,
  direction: SortDirection
): University[] =>
  [...data].sort((a, b) => {
    let valueA = 0
    let valueB = 0
    if (criteria === "taxaAceitacao") {
      valueA = Number(a.taxaAceitacao.replace("%", ""))
      valueB = Number(b.taxaAceitacao.replace("%", ""))
    } else if (criteria === "tuition") {
      valueA = Number(a.tuition.replace(/[^0-9]/g, ""))
      valueB = Number(b.tuition.replace(/[^0-9]/g, ""))
    } else if (criteria === "rankingNacional") {
      valueA = Number(
        a.rankingNacional.replace("N/A", String(Number.POSITIVE_INFINITY))
      )
      valueB = Number(
        b.rankingNacional.replace("N/A", String(Number.POSITIVE_INFINITY))
      )
    }
    return direction === "asc" ? valueA - valueB : valueB - valueA
  })

const initialFiltros: CollegeFiltros = {
  nome: "",
  estado: [],
  taxaAceitacao: "",
  notaSAT: "",
  notaACT: "",
  testesProficiencia: [],
  politicaFinanceira: [],
  majorsPrincipais: [],
}

type SortCriteria = "taxaAceitacao" | "tuition" | "rankingNacional"
type SortDirection = "asc" | "desc"

const CollegeListMain = () => {
  const [filtros, setFiltros] = useSessionStorage<CollegeFiltros>(
    "collegeFiltros",
    initialFiltros
  )
  const [filtrosTemporarios, setFiltrosTemporarios] =
    useState<CollegeFiltros>(filtros)
  const [universidadesFiltradas, setUniversidadesFiltradas] = useState<
    University[]
  >(universidadesOriginais as unknown as University[])
  const [showTitle, setShowTitle] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const isInitialMount = useRef(true)
  const [sortCriteria, setSortCriteria] =
    useState<SortCriteria>("rankingNacional")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 300)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  useEffect(() => {
    const dadosFiltrados = applyFilters(
      universidadesOriginais as unknown as University[],
      filtros
    )
    const sortedData = sortUniversities(
      dadosFiltrados,
      sortCriteria,
      sortDirection
    )
    setUniversidadesFiltradas(sortedData)

    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [filtros, sortCriteria, sortDirection])

  const isFilterActive = () =>
    Object.values(filtros).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== ""
    )

  const handleRemoveFilter = (
    key: keyof CollegeFiltros,
    valueToRemove: string
  ) => {
    setFiltros((prev) => {
      if (Array.isArray(prev[key])) {
        return {
          ...prev,
          [key]: (prev[key] as string[]).filter((val) => val !== valueToRemove),
        }
      }
      return { ...prev, [key]: initialFiltros[key] }
    })
  }

  const handleClearAllFilters = () => {
    setFiltros(initialFiltros)
    setFiltrosTemporarios(initialFiltros)
    setShowFilter(false)
  }

  const handleSort = (criteria: SortCriteria) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortCriteria(criteria)
      setSortDirection(criteria === "rankingNacional" ? "asc" : "desc")
    }
  }

  const handleToggleFilterSidebar = () => {
    setFiltrosTemporarios(filtros)
    setShowFilter((prev) => !prev)
  }

  const handleApplyFilters = () => {
    setFiltros(filtrosTemporarios)
    setShowFilter(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros((prev) => ({ ...prev, nome: e.target.value }))
  }

  const baseTransition = "transition-all duration-500 ease-in-out transform"
  const count = universidadesFiltradas.length
  const countText =
    count === 1
      ? "1 Universidade Encontrada"
      : `${count} Universidades Encontradas`

  const renderAppliedFilters = () => {
    const applied: { key: keyof CollegeFiltros; value: string }[] = []
    if (filtros.nome) {
      applied.push({ key: "nome", value: `Nome: ${filtros.nome}` })
    }
    if (filtros.estado.length > 0) {
      for (const e of filtros.estado) {
        applied.push({ key: "estado", value: getEstadoNome(e) })
      }
    }
    if (filtros.taxaAceitacao) {
      applied.push({
        key: "taxaAceitacao",
        value: `Aceitação > ${filtros.taxaAceitacao}%`,
      })
    }
    if (filtros.notaSAT) {
      applied.push({ key: "notaSAT", value: `SAT: ${filtros.notaSAT}` })
    }
    if (filtros.notaACT) {
      applied.push({ key: "notaACT", value: `ACT: ${filtros.notaACT}` })
    }
    for (const t of filtros.testesProficiencia) {
      applied.push({ key: "testesProficiencia", value: t })
    }
    for (const p of filtros.politicaFinanceira) {
      applied.push({ key: "politicaFinanceira", value: p })
    }

    return (
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white">
        {applied.map((filter) => (
          <span
            className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-white"
            key={`${filter.key}-${filter.value}`}
          >
            {filter.value}
            <button
              className="text-white opacity-70 transition-opacity hover:opacity-100"
              onClick={() => handleRemoveFilter(filter.key, filter.value)}
              type="button"
            >
              <FaTimesCircle className="ml-1" />
            </button>
          </span>
        ))}
      </div>
    )
  }

  const sortButtonClass = (criteria: SortCriteria) =>
    `px-2 py-1 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-1 text-xs ${sortCriteria === criteria ? "bg-amber-500 text-black" : "bg-slate-900 text-white hover:bg-slate-800"}`

  return (
    <div className="min-h-screen bg-slate-950 font-inter text-white">
      {!isFilterActive() && (
        <div
          className={`px-8 pt-8 pb-12 text-center ${baseTransition} ${showTitle ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <FaSearch className="text-4xl text-amber-500" />
            <h1 className="font-bold text-4xl text-amber-500">
              Busca por Faculdades
            </h1>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center font-light text-lg text-white">
            Encontre a faculdade perfeita para você. Busque, compare e gerencie
            sua jornada de aplicação em um só lugar.
          </p>
        </div>
      )}

      <div
        className={`px-6 md:hidden ${isFilterActive() ? "mt-4 mb-4" : "mt-0 mb-4"}`}
      >
        <div className="flex items-center gap-2">
          <div className="relative grow">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-white text-xs opacity-50" />
            <input
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 pr-3 pl-10 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              onChange={handleSearchInputChange}
              placeholder="Pesquisar por nome..."
              type="text"
              value={filtros.nome}
            />
          </div>
          <button
            className="rounded-lg bg-amber-500 px-4 py-2 text-black transition-colors hover:bg-amber-600"
            onClick={handleToggleFilterSidebar}
            type="button"
          >
            <FaSlidersH />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 md:hidden">
          <div className="max-h-[90vh] w-11/12 overflow-y-auto rounded-lg bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-amber-500 text-lg">Filtros</h2>
              <button
                className="text-white hover:text-amber-500"
                onClick={handleToggleFilterSidebar}
                type="button"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <CollegeFilter
              filtros={filtrosTemporarios}
              onClearFilters={() => setFiltrosTemporarios(initialFiltros)}
              setFiltros={setFiltrosTemporarios}
            />
            <div className="mt-4 flex gap-2">
              <button
                className="w-full rounded-lg bg-amber-500 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
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
                  <FaTimes /> Limpar Tudo
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col gap-6 px-6 md:mt-4 md:flex-row ${baseTransition} ${showContent ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
      >
        <div
          className={`hidden md:block md:w-1/4 ${baseTransition} ${showContent ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          <div className="sticky top-24 rounded-lg border border-slate-950 bg-slate-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center font-bold text-amber-500 text-lg">
              <FaSlidersH className="mr-2 text-amber-500" />
              Filtros
            </div>
            <CollegeFilter
              filtros={filtros}
              onClearFilters={handleClearAllFilters}
              setFiltros={setFiltros}
            />
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="mb-4 hidden w-full md:block">
            <div className="relative">
              <input
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 pr-3 pl-10 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                onChange={handleSearchInputChange}
                placeholder="Pesquisar por nome..."
                type="text"
                value={filtros.nome}
              />
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-white text-xs opacity-50" />
            </div>
          </div>
          <div className="mb-2 flex flex-col md:mb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 text-sm md:mt-0">
              {(
                [
                  {
                    criteria: "taxaAceitacao" as SortCriteria,
                    label: "Aceitação",
                  },
                  { criteria: "tuition" as SortCriteria, label: "Anuidade" },
                  {
                    criteria: "rankingNacional" as SortCriteria,
                    label: "Ranking",
                  },
                ] as const
              ).map(({ criteria, label }) => (
                <button
                  className={sortButtonClass(criteria)}
                  key={criteria}
                  onClick={() => handleSort(criteria)}
                  type="button"
                >
                  {label}
                  {sortCriteria === criteria &&
                    (sortDirection === "asc" ? (
                      <FaChevronUp className="h-4 w-4" />
                    ) : (
                      <FaChevronDown className="h-4 w-4" />
                    ))}
                </button>
              ))}
            </div>
            <p className="mt-4 font-semibold text-lg text-white md:mt-0 md:text-right">
              {countText}
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {renderAppliedFilters()}
          </div>

          <CollegeList
            data={universidadesFiltradas}
            onClearFilters={handleClearAllFilters}
          />
        </div>
      </div>
    </div>
  )
}

export default CollegeListMain
