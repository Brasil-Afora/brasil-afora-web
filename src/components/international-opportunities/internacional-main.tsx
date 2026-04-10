import { useEffect, useMemo, useRef, useState } from "react"
import { FaGlobeAmericas } from "react-icons/fa"
import { useOportunidadesInternacionais } from "../../hooks/use-oportunidades-internacionais"
import useSessionStorage from "../../hooks/use-session-storage"
import type { AppliedFilter } from "../opportunities/opportunities-main-layout"
import OpportunitiesMainLayout from "../opportunities/opportunities-main-layout"
import OpportunityList from "../opportunities/opportunity-list"
import type { OpportunityCardConfig } from "../opportunities/types"
import InternacionalFilter from "./internacional-filter"
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

const splitOpportunityTypes = (tipo: string): string[] =>
  tipo
    .split(/\s*[;,|]\s*|\s+\/\s+|\s+e\s+/i)
    .map((item) => item.trim())
    .filter(Boolean)

const matchesSelectedTypes = (
  opportunityType: string,
  selectedTypes: string[]
): boolean => {
  const normalizedSelected = selectedTypes.map((type) => type.toLowerCase())
  const parsedTypes = splitOpportunityTypes(opportunityType).map((type) =>
    type.toLowerCase()
  )
  return parsedTypes.some((type) => normalizedSelected.includes(type))
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
    result = result.filter((op) =>
      filtros.pais.some((pais) =>
        op.pais.toLowerCase().includes(pais.toLowerCase())
      )
    )
  }
  if (filtros.nivelEnsino.length > 0) {
    result = result.filter((op) =>
      filtros.nivelEnsino.some((nivel) =>
        op.nivelEnsino.toLowerCase().includes(nivel.toLowerCase())
      )
    )
  }
  if (filtros.tipo.length > 0) {
    result = result.filter((op) => matchesSelectedTypes(op.tipo, filtros.tipo))
  }
  if (filtros.requisitosIdioma.length > 0) {
    result = result.filter((op) =>
      filtros.requisitosIdioma.some((idioma) =>
        op.requisitosIdioma.toLowerCase().includes(idioma.toLowerCase())
      )
    )
  }
  if (filtros.taxaAplicacao.length > 0) {
    result = result.filter((op) =>
      filtros.taxaAplicacao.some((taxa) =>
        op.taxaAplicacao.toLowerCase().includes(taxa.toLowerCase())
      )
    )
  }
  if (filtros.tipoBolsa.length > 0) {
    result = result.filter((op) =>
      filtros.tipoBolsa.some((tipo) =>
        op.tipoBolsa.toLowerCase().includes(tipo.toLowerCase())
      )
    )
  }

  return result
}

const cardConfig: OpportunityCardConfig = {
  type: "international",
  basePath: "/oportunidades/internacionais",
  accentColor: "blue",
  showScholarship: true,
  showDuration: true,
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

  const isInitialMount = useRef(true)

  const oportunidadesFiltradas = useMemo(
    () => applyOpportunityFilters(oportunidadesInternacionais, filtros),
    [oportunidadesInternacionais, filtros]
  )

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [filtros])

  const isFilterActive =
    filtros.idade !== "" ||
    filtros.pais.length > 0 ||
    filtros.nivelEnsino.length > 0 ||
    filtros.tipo.length > 0 ||
    filtros.requisitosIdioma.length > 0 ||
    filtros.taxaAplicacao.length > 0 ||
    filtros.tipoBolsa.length > 0

  const appliedFilters: AppliedFilter[] = useMemo(() => {
    const result: AppliedFilter[] = []

    if (filtros.idade) {
      result.push({ key: "idade", value: `Idade: ${filtros.idade}` })
    }
    for (const p of filtros.pais) {
      result.push({ key: "pais", value: p })
    }
    for (const n of filtros.nivelEnsino) {
      result.push({ key: "nivelEnsino", value: n })
    }
    for (const t of filtros.tipo) {
      result.push({ key: "tipo", value: t })
    }
    for (const i of filtros.requisitosIdioma) {
      result.push({ key: "requisitosIdioma", value: i })
    }
    for (const t of filtros.taxaAplicacao) {
      result.push({ key: "taxaAplicacao", value: t })
    }
    for (const t of filtros.tipoBolsa) {
      result.push({ key: "tipoBolsa", value: t })
    }

    return result
  }, [filtros])

  const handleRemoveFilter = (key: string, valueToRemove: string) => {
    setFiltros((prev) => {
      const filterKey = key as keyof OpportunitiesFiltros
      if (Array.isArray(prev[filterKey])) {
        return {
          ...prev,
          [filterKey]: (prev[filterKey] as string[]).filter(
            (val) => val !== valueToRemove
          ),
        }
      }
      return { ...prev, [filterKey]: initialFiltros[filterKey] }
    })
  }

  const handleClearFilters = () => {
    setFiltros(initialFiltros)
    setFiltrosTemporarios(initialFiltros)
  }

  const handleApplyMobileFilters = () => {
    setFiltros(filtrosTemporarios)
  }

  return (
    <OpportunitiesMainLayout
      accentColor="blue"
      appliedFilters={appliedFilters}
      error={error}
      filterComponent={
        <InternacionalFilter
          filtros={filtros}
          filtrosIniciais={initialFiltros}
          setFiltros={setFiltros}
        />
      }
      icon={FaGlobeAmericas}
      isFilterActive={isFilterActive}
      loading={loading}
      mobileFilterComponent={
        <InternacionalFilter
          filtros={filtrosTemporarios}
          filtrosIniciais={initialFiltros}
          setFiltros={setFiltrosTemporarios}
        />
      }
      onApplyMobileFilters={handleApplyMobileFilters}
      onClearFilters={handleClearFilters}
      onRemoveFilter={handleRemoveFilter}
      resultCount={oportunidadesFiltradas.length}
      subtitle="Explore bolsas de estudo, summer camps e intercâmbios ao redor do mundo."
      title="Oportunidades Internacionais"
    >
      <OpportunityList config={cardConfig} data={oportunidadesFiltradas} />
    </OpportunitiesMainLayout>
  )
}

export default InternacionalMain
