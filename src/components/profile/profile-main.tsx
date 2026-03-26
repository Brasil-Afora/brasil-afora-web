import { useCallback, useEffect, useState } from "react"
import {
  getInternationalFavorites,
  getNationalFavorites,
  removeInternationalFavorite,
  removeNationalFavorite,
} from "../../lib/opportunities-api"
import ProfileConfirmationPopup from "./profile-confirmation-popup"
import ProfileOpportunities from "./profile-opportunities"
import type { FavoriteOpportunity } from "./types"

interface PopupState {
  message: string
  visible: boolean
}

interface ConfirmationState {
  categoria: "internacional" | "nacional"
  detalhePath: string
  id: string
  name: string
}

const ProfileMain = () => {
  const [favoriteOpportunities, setFavoriteOpportunities] = useState<
    FavoriteOpportunity[]
  >([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"favorites">("favorites")
  const [confirmationPopup, setConfirmationPopup] =
    useState<ConfirmationState | null>(null)
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    message: "",
  })

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true)
      const [international, national] = await Promise.all([
        getInternationalFavorites(),
        getNationalFavorites(),
      ])

      const internationalFavorites: FavoriteOpportunity[] = international.map(
        (op) => ({
          id: op.id,
          nome: op.nome,
          imagem: op.imagem,
          pais: op.pais,
          prazoInscricao: op.prazoInscricao,
          categoria: "internacional" as const,
          detalhePath: `/oportunidades/internacionais/${op.id}`,
        })
      )

      const nationalFavorites: FavoriteOpportunity[] = national.map((op) => ({
        id: op.id,
        nome: op.nome,
        imagem: op.imagem,
        pais: op.pais,
        prazoInscricao: op.prazoInscricao,
        categoria: "nacional" as const,
        detalhePath: `/oportunidades/nacionais/${op.id}`,
      }))

      setFavoriteOpportunities([...internationalFavorites, ...nationalFavorites])
    } catch {
      setPopup({
        visible: true,
        message: "Erro ao carregar favoritos.",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  useEffect(() => {
    if (popup.visible) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [popup.visible])

  const handleRemoveFromList = (
    detalhePath: string,
    name: string,
    id: string,
    categoria: "internacional" | "nacional"
  ) => {
    setConfirmationPopup({ detalhePath, name, id, categoria })
  }

  const handleConfirmRemove = async () => {
    if (!confirmationPopup) {
      return
    }
    const { id, name, categoria } = confirmationPopup

    try {
      if (categoria === "internacional") {
        await removeInternationalFavorite(id)
      } else {
        await removeNationalFavorite(id)
      }
      setFavoriteOpportunities((prev) => prev.filter((fav) => fav.id !== id))
      setPopup({ visible: true, message: `"${name}" removido(a) com sucesso!` })
    } catch {
      setPopup({ visible: true, message: "Erro ao remover favorito." })
    }
    setConfirmationPopup(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-white/60 text-xl">Carregando favoritos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-inter text-white">
      <h1 className="mb-8 text-center font-extrabold text-5xl text-amber-500">
        Meu Perfil
      </h1>

      <div className="mx-auto mb-8 flex w-full max-w-sm rounded-full border border-slate-950 bg-slate-900 p-1 shadow-lg">
        <button
          className={`flex-1 rounded-full px-4 py-2 font-semibold text-sm transition-colors duration-200 ${activeTab === "favorites" ? "bg-amber-500 text-black" : "text-white hover:bg-slate-800"}`}
          onClick={() => setActiveTab("favorites")}
          type="button"
        >
          Oportunidades Salvas
        </button>
      </div>

      {activeTab === "favorites" && (
        <ProfileOpportunities
          favoriteOpportunities={favoriteOpportunities}
          handleRemoveFromList={handleRemoveFromList}
        />
      )}

      <ProfileConfirmationPopup
        name={confirmationPopup?.name ?? null}
        onCancel={() => setConfirmationPopup(null)}
        onConfirm={handleConfirmRemove}
      />

      {popup.visible && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4 rounded-lg border border-slate-950 bg-slate-900 p-4 text-white shadow-lg">
          <span>{popup.message}</span>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => setPopup((prev) => ({ ...prev, visible: false }))}
            type="button"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMain
