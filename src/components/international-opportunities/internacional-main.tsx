import { useEffect, useRef, useState } from "react"
import {
  FaCheck,
  FaFilter,
  FaGlobeAmericas,
  FaSlidersH,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa"
import { useOportunidadesInternacionais } from "../../hooks/use-oportunidades-internacionais"
import useSessionStorage from "../../hooks/use-session-storage"
import InternacionalFilter from "./internacional-filter"
import InternacionalList from "./internacional-list"
import type { OpportunitiesFiltros, Opportunity } from "./types"

const initialFiltros: OpportunitiesFiltros = {
  idade: "",
  pais: [],
  nivelEnsino: [],
  tipo: [],
  requisitosIdioma: [],
  taxaAplicacao: [],
  tipoBolsa: [],
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
  if (filtros.pais.length > 0) {
    result = result.filter((op) => filtros.pais.includes(op.pais))
  }
  if (filtros.nivelEnsino.length > 0) {
    result = result.filter((op) => filtros.nivelEnsino.includes(op.nivelEnsino))
  }
  if (filtros.tipo.length > 0) {
    result = result.filter((op) => filtros.tipo.includes(op.tipo))
  }
  if (filtros.requisitosIdioma.length > 0) {
    result = result.filter((op) =>
      filtros.requisitosIdioma.some((idioma) =>
        op.requisitosIdioma.includes(idioma)
      )
    )
  }
  if (filtros.taxaAplicacao.length > 0) {
    result = result.filter((op) =>
      filtros.taxaAplicacao.includes(op.taxaAplicacao)
    )
  }
  if (filtros.tipoBolsa.length > 0) {
    result = result.filter((op) => filtros.tipoBolsa.includes(op.tipoBolsa))
  }
  return result
}

const InternacionalMain = () => {
  const {
    data: oportunidadesInternacionais,
    loading,
    error,
  } = useOportunidadesInternacionais()
  const [filtros, setFiltros] = useSessionStorage<OpportunitiesFiltros>(
    "internacionalFiltros",
    initialFiltros
  )
  const [filtrosTemporarios, setFiltrosTemporarios] =
    useState<OpportunitiesFiltros>(filtros)
  const [oportunidadesFiltradas, setOportunidadesFiltradas] = useState<
    Opportunity[]
  >([])
  const [showTitle, setShowTitle] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const isInitialMount = useRef(true)
  const [showFilter, setShowFilter] = useState(false)

  const isFilterActive = () =>
    filtros.idade !== "" ||
    filtros.pais.length > 0 ||
    filtros.nivelEnsino.length > 0 ||
    filtros.tipo.length > 0 ||
    filtros.requisitosIdioma.length > 0 ||
    filtros.taxaAplicacao.length > 0 ||
    filtros.tipoBolsa.length > 0

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 300)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  useEffect(() => {
    const dadosFiltrados = applyOpportunityFilters(
      oportunidadesInternacionais,
      filtros
    )
    setOportunidadesFiltradas(dadosFiltrados)
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [filtros, oportunidadesInternacionais])

  const handleRemoveFilter = (
    key: keyof OpportunitiesFiltros,
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
    if (filtros.idade) {
      applied.push({ key: "idade", value: `Idade: ${filtros.idade}` })
    }
    for (const p of filtros.pais) {
      applied.push({ key: "pais", value: p })
    }
    for (const n of filtros.nivelEnsino) {
      applied.push({ key: "nivelEnsino", value: n })
    }
    for (const t of filtros.tipo) {
      applied.push({ key: "tipo", value: t })
    }
    for (const i of filtros.requisitosIdioma) {
      applied.push({ key: "requisitosIdioma", value: i })
    }
    for (const t of filtros.taxaAplicacao) {
      applied.push({ key: "taxaAplicacao", value: t })
    }
    for (const t of filtros.tipoBolsa) {
      applied.push({ key: "tipoBolsa", value: t })
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

  return (
    <div className="min-h-screen bg-slate-950 font-inter text-white">
      {loading && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-white/60">Carregando oportunidades...</p>
        </div>
      )}
      {error && !loading && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      {!(loading || error) && (
        <>
          {!isFilterActive() && (
            <div
              className={`px-8 pt-10 pb-6 text-center ${baseTransition} ${showTitle ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <div className="mb-2 flex items-center justify-center gap-2">
                <FaGlobeAmericas className="text-3xl text-blue-400" />
                <h1 className="font-bold text-3xl text-blue-400">
                  Oportunidades Internacionais
                </h1>
              </div>
              <p className="mx-auto mt-2 max-w-xl text-sm text-white/50">
                Explore bolsas de estudo, summer camps e intercâmbios ao redor
                do mundo.
              </p>
            </div>
          )}

          {showFilter && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 md:hidden">
              <div className="max-h-[90vh] w-11/12 overflow-y-auto rounded-lg bg-slate-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-blue-400 text-lg">Filtros</h2>
                  <button
                    className="text-white hover:text-blue-400"
                    onClick={handleToggleFilterSidebar}
                    type="button"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <InternacionalFilter
                  filtros={filtrosTemporarios}
                  filtrosIniciais={initialFiltros}
                  setFiltros={setFiltrosTemporarios}
                />
                <div className="mt-4 flex gap-2">
                  <button
                    className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
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
              <div className="sticky top-24 rounded-lg border border-blue-500/20 bg-slate-900 p-6 shadow-lg">
                <div className="mb-4 flex items-center font-bold text-blue-400 text-lg">
                  <FaFilter className="mr-2 text-blue-400" />
                  Filtros
                </div>
                <InternacionalFilter
                  filtros={filtros}
                  filtrosIniciais={initialFiltros}
                  setFiltros={setFiltros}
                />
              </div>
            </div>

            <div
              className={`md:w-3/4 ${baseTransition} ${showContent ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <p className="font-semibold text-lg text-white">
                  {`Exibindo ${oportunidadesFiltradas.length} oportunidades`}
                </p>
                <div className="mt-4 w-full md:hidden">
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                    onClick={handleToggleFilterSidebar}
                    type="button"
                  >
                    <FaSlidersH /> Abrir Filtros
                  </button>
                </div>
                {renderAppliedFilters()}
              </div>

              {oportunidadesFiltradas.length > 0 ? (
                <InternacionalList data={oportunidadesFiltradas} />
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
                    className="rounded-full bg-blue-500 px-6 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-600"
                    onClick={handleClearAllFilters}
                    type="button"
                  >
                    Limpar Todos os Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default InternacionalMain
