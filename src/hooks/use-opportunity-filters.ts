import type { Dispatch, SetStateAction } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { InternationalOpportunity, NationalOpportunity } from "../lib/opportunities-api"
import useSessionStorage from "./use-session-storage"

type Opportunity = InternationalOpportunity | NationalOpportunity

interface BaseFilters {
  idade: string
  nivelEnsino: string[]
  taxaAplicacao: string[]
  tipo: string[]
}

interface InternationalFilters extends BaseFilters {
  pais: string[]
  requisitosIdioma: string[]
  tipoBolsa: string[]
}

interface NationalFilters extends BaseFilters {
  modalidade: string[]
}

type Filters = InternationalFilters | NationalFilters

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

const applyBaseFilters = <T extends Opportunity>(
  data: T[],
  filtros: BaseFilters
): T[] => {
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

  return result
}

const applyInternationalFilters = (
  data: InternationalOpportunity[],
  filtros: InternationalFilters
): InternationalOpportunity[] => {
  let result = applyBaseFilters(data, filtros)

  if (filtros.pais.length > 0) {
    result = result.filter((op) =>
      filtros.pais.some(pais =>
        op.pais.toLowerCase().includes(pais.toLowerCase())
      )
    )
  }

  if (filtros.requisitosIdioma.length > 0) {
    result = result.filter((op) =>
      filtros.requisitosIdioma.some(idioma =>
        op.requisitosIdioma.toLowerCase().includes(idioma.toLowerCase())
      )
    )
  }

  if (filtros.tipoBolsa.length > 0) {
    result = result.filter((op) =>
      filtros.tipoBolsa.some(tipo =>
        op.tipoBolsa.toLowerCase().includes(tipo.toLowerCase())
      )
    )
  }

  return result
}

const applyNationalFilters = (
  data: NationalOpportunity[],
  filtros: NationalFilters
): NationalOpportunity[] => {
  let result = applyBaseFilters(data, filtros)

  if (filtros.modalidade.length > 0) {
    result = result.filter((op) =>
      filtros.modalidade.some(modalidade =>
        op.modalidade.toLowerCase().includes(modalidade.toLowerCase())
      )
    )
  }

  return result
}

interface UseOpportunityFiltersResult<T extends Opportunity, F extends Filters> {
  clearFilters: () => void
  filteredData: T[]
  filtros: F
  filtrosTemporarios: F
  isFilterActive: boolean
  setFiltros: Dispatch<SetStateAction<F>>
  setFiltrosTemporarios: Dispatch<SetStateAction<F>>
}

function useOpportunityFilters<T extends Opportunity, F extends Filters>(
  data: T[],
  initialFilters: F,
  storageKey: string,
  type: "international" | "national"
): UseOpportunityFiltersResult<T, F> {
  const [filtros, setFiltros] = useSessionStorage<F>(storageKey, initialFilters)
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<F>(filtros)
  const isInitialMount = useRef(true)

  const filteredData = useMemo(() => {
    if (type === "international") {
      return applyInternationalFilters(
        data as InternationalOpportunity[],
        filtros as InternationalFilters
      ) as T[]
    }
    return applyNationalFilters(
      data as NationalOpportunity[],
      filtros as NationalFilters
    ) as T[]
  }, [data, filtros, type])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [filtros])

  const isFilterActive = useMemo(() => {
    if (filtros.idade !== "") return true
    if (filtros.nivelEnsino.length > 0) return true
    if (filtros.tipo.length > 0) return true
    if (filtros.taxaAplicacao.length > 0) return true

    if (type === "international") {
      const f = filtros as InternationalFilters
      if (f.pais.length > 0) return true
      if (f.requisitosIdioma.length > 0) return true
      if (f.tipoBolsa.length > 0) return true
    } else {
      const f = filtros as NationalFilters
      if (f.modalidade.length > 0) return true
    }

    return false
  }, [filtros, type])

  const clearFilters = () => {
    setFiltros(initialFilters)
    setFiltrosTemporarios(initialFilters)
  }

  return {
    filtros,
    setFiltros,
    filtrosTemporarios,
    setFiltrosTemporarios,
    filteredData,
    isFilterActive,
    clearFilters,
  }
}

export default useOpportunityFilters
export type { InternationalFilters, NationalFilters }
