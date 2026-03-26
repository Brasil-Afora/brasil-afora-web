import { useEffect, useMemo, useRef, useState } from "react"
import { FaTrophy } from "react-icons/fa"
import { useOportunidadesNacionais } from "../../hooks/use-oportunidades-nacionais"
import useSessionStorage from "../../hooks/use-session-storage"
import type { AppliedFilter } from "../opportunities/opportunities-main-layout"
import OpportunitiesMainLayout from "../opportunities/opportunities-main-layout"
import OpportunityList from "../opportunities/opportunity-list"
import type { OpportunityCardConfig } from "../opportunities/types"
import NacionalFilter from "./nacional-filter"
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
  if (filtros.nivelEnsino.length > 0) {
    result = result.filter((op) =>
      filtros.nivelEnsino.some(nivel =>
        op.nivelEnsino.toLowerCase().includes(nivel.toLowerCase())
      )
    )
  }
  if (filtros.tipo.length > 0) {
    result = result.filter((op) =>
      filtros.tipo.some(tipo =>
        op.tipo.toLowerCase().includes(tipo.toLowerCase())
      )
    )
  }
  if (filtros.taxaAplicacao.length > 0) {
    result = result.filter((op) =>
      filtros.taxaAplicacao.some(taxa =>
        op.taxaAplicacao.toLowerCase().includes(taxa.toLowerCase())
      )
    )
  }
  if (filtros.modalidade.length > 0) {
    result = result.filter((op) =>
      filtros.modalidade.some(modalidade =>
        op.modalidade.toLowerCase().includes(modalidade.toLowerCase())
      )
    )
  }

  return result
}

const cardConfig: OpportunityCardConfig = {
  type: "national",
  basePath: "/oportunidades/nacionais",
  accentColor: "amber",
  showModalidade: true,
}

const NacionalMain = () => {
  const {
    data: oportunidadesNacionais,
    loading,
    error,
  } = useOportunidadesNacionais()

  const [filtros, setFiltros] = useSessionStorage<OpportunitiesFiltros>(
    "nacionalFiltros",
    initialFiltros
  )
  const [filtrosTemporarios, setFiltrosTemporarios] =
    useState<OpportunitiesFiltros>(filtros)

  const isInitialMount = useRef(true)

  const oportunidadesFiltradas = useMemo(
    () => applyOpportunityFilters(oportunidadesNacionais, filtros),
    [oportunidadesNacionais, filtros]
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
    filtros.nivelEnsino.length > 0 ||
    filtros.tipo.length > 0 ||
    filtros.taxaAplicacao.length > 0 ||
    filtros.modalidade.length > 0

  const appliedFilters: AppliedFilter[] = useMemo(() => {
    const result: AppliedFilter[] = []

    if (filtros.idade) {
      result.push({ key: "idade", value: `Idade: ${filtros.idade}` })
    }
    for (const n of filtros.nivelEnsino) {
      result.push({ key: "nivelEnsino", value: n })
    }
    for (const t of filtros.tipo) {
      result.push({ key: "tipo", value: t })
    }
    for (const t of filtros.taxaAplicacao) {
      result.push({ key: "taxaAplicacao", value: t })
    }
    for (const m of filtros.modalidade) {
      result.push({ key: "modalidade", value: m })
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
      accentColor="amber"
      appliedFilters={appliedFilters}
      error={error}
      filterComponent={
        <NacionalFilter
          filtros={filtros}
          filtrosIniciais={initialFiltros}
          setFiltros={setFiltros}
        />
      }
      icon={FaTrophy}
      isFilterActive={isFilterActive}
      loading={loading}
      mobileFilterComponent={
        <NacionalFilter
          filtros={filtrosTemporarios}
          filtrosIniciais={initialFiltros}
          setFiltros={setFiltrosTemporarios}
        />
      }
      onApplyMobileFilters={handleApplyMobileFilters}
      onClearFilters={handleClearFilters}
      onRemoveFilter={handleRemoveFilter}
      resultCount={oportunidadesFiltradas.length}
      subtitle="Encontre olimpíadas, feiras científicas e projetos de liderança no Brasil."
      title="Oportunidades Nacionais"
    >
      <OpportunityList config={cardConfig} data={oportunidadesFiltradas} />
    </OpportunitiesMainLayout>
  )
}

export default NacionalMain
