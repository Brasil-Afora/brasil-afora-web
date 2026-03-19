import { useEffect, useRef, useState } from "react"
import {
  FaCheck,
  FaExclamationTriangle,
  FaFilter,
  FaSlidersH,
  FaTimes,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa"
import useSessionStorage from "../../hooks/use-session-storage"
import { getNationalOpportunities } from "../../lib/opportunities-api"
import NacionalFilter from "./nacional-filter"
import NacionalList from "./nacional-list"
import type { OpportunitiesFiltros, Opportunity } from "./types"

const initialFiltros: OpportunitiesFiltros = {
  idade: "",
  nivelEnsino: [],
  tipo: [],
  taxaAplicacao: [],
  modalidade: [],
}

const isAgeInRange = (faixaEtaria: string, age: number): boolean => {
  const numeros = faixaEtaria.match(/\d+/g)?.map(Number)
  if (!numeros) {
    return false
  }
  if (numeros.length === 2) {
    return age >= numeros[0] && age <= numeros[1]
  }
  if (numeros.length === 1 && faixaEtaria.includes("+")) {
    return age >= numeros[0]
  }
  if (numeros.length === 1) {
    return age === numeros[0]
  }
  return false
}

const applyOpportunityFilters = (
  data: Opportunity[],
  filtros: OpportunitiesFiltros
): Opportunity[] => {
  let result = data
  if (filtros.idade) {
    const idadeInput = Number(filtros.idade)
    if (!Number.isNaN(idadeInput)) {
      result = result.filter((op) =>
        op.faixaEtaria ? isAgeInRange(op.faixaEtaria, idadeInput) : false
      )
    }
  }
  if (filtros.nivelEnsino.length > 0) result = result.filter((op) => filtros.nivelEnsino.includes(op.nivelEnsino))
  if (filtros.tipo.length > 0) result = result.filter((op) => filtros.tipo.includes(op.tipo))
  if (filtros.taxaAplicacao.length > 0) result = result.filter((op) => filtros.taxaAplicacao.includes(op.taxaAplicacao))
  if (filtros.modalidade.length > 0) result = result.filter((op) => filtros.modalidade.includes(op.modalidade))
  return result
}

const NacionalMain = () => {
  const [filtros, setFiltros] = useSessionStorage<OpportunitiesFiltros>(
    "nacionalFiltros",
    initialFiltros
  )
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<OpportunitiesFiltros>(filtros)
  const [oportunidades, setOportunidades] = useState<Opportunity[]>([])
  const [oportunidadesFiltradas, setOportunidadesFiltradas] = useState<Opportunity[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [showTitle, setShowTitle] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const isInitialMount = useRef(true)
  const [showFilter, setShowFilter] = useState(false)

  const isFilterActive = () =>
    filtros.idade !== "" ||
    filtros.nivelEnsino.length > 0 ||
    filtros.tipo.length > 0 ||
    filtros.taxaAplicacao.length > 0 ||
    filtros.modalidade.length > 0

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 300)
    return () => { clearTimeout(timer1); clearTimeout(timer2) }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setErrorMessage("")
        const data = await getNationalOpportunities()
        setOportunidades(data as Opportunity[])
      } catch {
        setErrorMessage("Nao foi possivel carregar as oportunidades nacionais.")
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [])

  useEffect(() => {
    const dadosFiltrados = applyOpportunityFilters(oportunidades, filtros)
    setOportunidadesFiltradas(dadosFiltrados)
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [filtros, oportunidades])

  const handleRemoveFilter = (key: keyof OpportunitiesFiltros, valueToRemove: string) => {
    setFiltros((prev) => {
      if (Array.isArray(prev[key])) {
        return { ...prev, [key]: (prev[key] as string[]).filter((val) => val !== valueToRemove) }
      }
      return { ...prev, [key]: initialFiltros[key] }
    })
  }

  const handleClearAllFilters = () => {
    setFiltros(initialFiltros)
    setFiltrosTemporarios(initialFiltros)
    setShowFilter(false)
  }

  const handleToggleFilterSidebar = () => {
    setFiltrosTemporarios(filtros)
    setShowFilter((prev) => !prev)
  }

  const handleApplyFilters = () => {
    setFiltros(filtrosTemporarios)
    setShowFilter(false)
  }

  const baseTransition = "transition-all duration-500 ease-in-out transform"

  const renderAppliedFilters = () => {
    const applied: { key: keyof OpportunitiesFiltros; value: string }[] = []
    if (filtros.idade) applied.push({ key: "idade", value: `Idade: ${filtros.idade}` })
    for (const n of filtros.nivelEnsino) applied.push({ key: "nivelEnsino", value: n })
    for (const t of filtros.tipo) applied.push({ key: "tipo", value: t })
    for (const t of filtros.taxaAplicacao) applied.push({ key: "taxaAplicacao", value: t })
    for (const m of filtros.modalidade) applied.push({ key: "modalidade", value: m })

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

  return (
    <div className="min-h-screen bg-slate-950 font-inter text-white">
      {!isFilterActive() && (
        <div
          className={`px-8 pt-10 pb-6 text-center ${baseTransition} ${showTitle ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <FaTrophy className="text-3xl text-amber-500" />
            <h1 className="font-bold text-3xl text-amber-500">
              Oportunidades Nacionais
            </h1>
          </div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/50">
            Encontre olimpíadas, feiras científicas e projetos de liderança no
            Brasil.
          </p>
        </div>
      )}

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
            <NacionalFilter
              filtros={filtrosTemporarios}
              filtrosIniciais={initialFiltros}
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
          <div className="sticky top-24 rounded-lg border border-amber-500/20 bg-slate-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center font-bold text-amber-500 text-lg">
              <FaFilter className="mr-2 text-amber-500" />
              Filtros
            </div>
            <NacionalFilter
              filtros={filtros}
              filtrosIniciais={initialFiltros}
              setFiltros={setFiltros}
            />
          </div>
        </div>

        <div
          className={`md:w-3/4 ${baseTransition} ${showContent ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          {isLoading && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-slate-900 p-4 text-white">
              Carregando oportunidades nacionais...
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
              <FaExclamationTriangle />
              <span>{errorMessage}</span>
            </div>
          )}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="font-semibold text-lg text-white">
              {`Exibindo ${oportunidadesFiltradas.length} oportunidades`}
            </p>
            <div className="mt-4 w-full md:hidden">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
                onClick={handleToggleFilterSidebar}
                type="button"
              >
                <FaSlidersH /> Abrir Filtros
              </button>
            </div>
            {renderAppliedFilters()}
          </div>

          {oportunidadesFiltradas.length > 0 ? (
            <NacionalList data={oportunidadesFiltradas} />
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <img
                alt="Logo Global Passport"
                className="mb-4 h-16 w-auto object-contain opacity-80"
                height={64}
                src="/logo.png"
                width={64}
              />
              <h3 className="mb-2 font-bold text-2xl text-white">
                Nenhuma oportunidade encontrada
              </h3>
              <p className="mb-6 text-sm text-white/60">
                Tente ajustar seus filtros para ver mais resultados.
              </p>
              <button
                className="rounded-full bg-amber-500 px-6 py-2 font-bold text-black transition-colors duration-300 hover:bg-amber-600"
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

export default NacionalMain
