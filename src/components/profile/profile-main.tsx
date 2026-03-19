import { useEffect, useState } from "react"
import useLocalStorage from "../../hooks/use-local-storage"
import ProfileConfirmationPopup from "./profile-confirmation-popup"
import ProfileOpportunities from "./profile-opportunities"
import type { FavoriteOpportunity } from "./types"

interface PopupState {
  message: string
  visible: boolean
}

interface ConfirmationState {
  detalhePath: string
  name: string
}

const ProfileMain = () => {
  const [favoriteOpportunities, setFavoriteOpportunities] = useLocalStorage<
    FavoriteOpportunity[]
  >("favorites", [])
  const [activeTab, setActiveTab] = useState<"favorites">("favorites")
  const [confirmationPopup, setConfirmationPopup] =
    useState<ConfirmationState | null>(null)
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    message: "",
  })

  useEffect(() => {
    setFavoriteOpportunities((prev) =>
      prev.map((fav) => {
        const favoriteId = String(fav.id)
        if (fav.detalhePath && fav.categoria) {
          return {
            ...fav,
            id: favoriteId,
          }
        }

        const categoria = fav.detalhePath?.includes("/nacionais/")
          ? "nacional"
          : "internacional"

        return {
          ...fav,
          id: favoriteId,
          categoria,
          detalhePath:
            categoria === "nacional"
              ? `/oportunidades/nacionais/${favoriteId}`
              : `/oportunidades/internacionais/${favoriteId}`,
        }
      })
    )
  }, [setFavoriteOpportunities])

  useEffect(() => {
    if (popup.visible) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [popup.visible])

  const handleRemoveFromList = (detalhePath: string, name: string) => {
    setConfirmationPopup({ detalhePath, name })
  }

  const handleConfirmRemove = () => {
    if (!confirmationPopup) {
      return
    }
    const { detalhePath, name } = confirmationPopup
    setFavoriteOpportunities(
      favoriteOpportunities.filter((fav) => fav.detalhePath !== detalhePath)
    )
    setPopup({ visible: true, message: `"${name}" removido(a) com sucesso!` })
    setConfirmationPopup(null)
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
