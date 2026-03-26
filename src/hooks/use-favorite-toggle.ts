import { useCallback, useEffect, useState } from "react"
import {
  addInternationalFavorite,
  addNationalFavorite,
  getInternationalFavorites,
  getNationalFavorites,
  removeInternationalFavorite,
  removeNationalFavorite,
} from "../lib/opportunities-api"

type OpportunityType = "international" | "national"

interface UseFavoriteToggleResult {
  confirmRemove: () => Promise<void>
  isFavorited: boolean
  isLoading: boolean
  setShowConfirmation: (show: boolean) => void
  showConfirmation: boolean
  toggleFavorite: () => Promise<{ error?: string; success?: string }>
}

const getFavoriteApiFns = (type: OpportunityType) => {
  if (type === "international") {
    return {
      getFavorites: getInternationalFavorites,
      addFavorite: addInternationalFavorite,
      removeFavorite: removeInternationalFavorite,
    }
  }
  return {
    getFavorites: getNationalFavorites,
    addFavorite: addNationalFavorite,
    removeFavorite: removeNationalFavorite,
  }
}

function useFavoriteToggle(
  opportunityId: string | undefined,
  type: OpportunityType
): UseFavoriteToggleResult {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const { getFavorites, addFavorite, removeFavorite } = getFavoriteApiFns(type)

  useEffect(() => {
    if (!opportunityId) {
      return
    }

    let cancelled = false

    const checkFavoriteStatus = async () => {
      try {
        const favorites = await getFavorites()
        if (!cancelled) {
          setIsFavorited(favorites.some((fav) => fav.id === opportunityId))
        }
      } catch {
        // Ignore errors when checking favorite status
      }
    }

    checkFavoriteStatus()

    return () => {
      cancelled = true
    }
  }, [opportunityId, getFavorites])

  const toggleFavorite = useCallback(async (): Promise<{
    error?: string
    success?: string
  }> => {
    if (!opportunityId) {
      return { error: "ID da oportunidade não encontrado." }
    }

    if (isFavorited) {
      setShowConfirmation(true)
      return {}
    }

    setIsLoading(true)
    try {
      await addFavorite(opportunityId)
      setIsFavorited(true)
      return { success: "Oportunidade adicionada aos seus Favoritos!" }
    } catch {
      return { error: "Erro ao adicionar aos favoritos." }
    } finally {
      setIsLoading(false)
    }
  }, [opportunityId, isFavorited, addFavorite])

  const confirmRemove = useCallback(async (): Promise<void> => {
    if (!opportunityId) {
      return
    }

    setIsLoading(true)
    try {
      await removeFavorite(opportunityId)
      setIsFavorited(false)
    } catch {
      // Error handled by caller
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }, [opportunityId, removeFavorite])

  return {
    isFavorited,
    isLoading,
    showConfirmation,
    setShowConfirmation,
    toggleFavorite,
    confirmRemove,
  }
}

export default useFavoriteToggle
