import { useEffect, useState } from "react"
import type { Opportunity } from "../components/international-opportunities/types"
import { apiFetch } from "../lib/api"

interface UseOportunidadesInternacionaisResult {
  data: Opportunity[]
  error: string | null
  loading: boolean
}

export const useOportunidadesInternacionais =
  (): UseOportunidadesInternacionaisResult => {
    const [data, setData] = useState<Opportunity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      let cancelled = false

      const fetchData = async () => {
        try {
          const result = await apiFetch<Opportunity[]>(
            "/oportunidades/internacionais"
          )
          if (!cancelled) {
            setData(result)
          }
        } catch (err) {
          if (!cancelled) {
            setError(
              err instanceof Error
                ? err.message
                : "Erro ao carregar oportunidades internacionais."
            )
          }
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      }

      fetchData()

      return () => {
        cancelled = true
      }
    }, [])

    return { data, loading, error }
  }
