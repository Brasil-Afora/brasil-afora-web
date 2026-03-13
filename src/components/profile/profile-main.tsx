import { useEffect, useState } from "react"
import useLocalStorage from "../../hooks/use-local-storage"
import type { University } from "../college-list/types"
import type { Opportunity } from "../opportunities/types"
import ProfileCollegeList from "./profile-college-list"
import ProfileConfirmationPopup from "./profile-confirmation-popup"
import ProfileOpportunities from "./profile-opportunities"

interface PopupState {
  message: string
  visible: boolean
}

interface ConfirmationState {
  id: number
  listName: string
  name: string
}

interface ChecklistItem {
  completed: boolean
  text: string
}
type ApplicationChecklist = Record<number, ChecklistItem[]>

const ProfileMain = () => {
  const [myCollegeList, setMyCollegeList] = useLocalStorage<University[]>(
    "myCollegeList",
    []
  )
  const [favoriteOpportunities, setFavoriteOpportunities] = useLocalStorage<
    Opportunity[]
  >("favorites", [])
  const [applicationChecklist, setApplicationChecklist] =
    useLocalStorage<ApplicationChecklist>("applicationChecklist", {})
  const [activeTab, setActiveTab] = useState<"favorites" | "collegeList">(
    "favorites"
  )
  const [confirmationPopup, setConfirmationPopup] =
    useState<ConfirmationState | null>(null)
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    message: "",
  })

  useEffect(() => {
    if (popup.visible) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [popup.visible])

  const handleRemoveFromList = (id: number, listName: string, name: string) => {
    setConfirmationPopup({ id, listName, name })
  }

  const handleConfirmRemove = () => {
    if (!confirmationPopup) {
      return
    }
    const { id, listName, name } = confirmationPopup
    if (listName === "myCollegeList") {
      setMyCollegeList(myCollegeList.filter((uni) => uni.id !== id))
      setApplicationChecklist((prev) => {
        const newChecklist = { ...prev }
        delete newChecklist[id]
        return newChecklist
      })
    } else if (listName === "favorites") {
      setFavoriteOpportunities(
        favoriteOpportunities.filter((fav) => fav.id !== id)
      )
    }
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
          Intercâmbios Salvos
        </button>
        <button
          className={`flex-1 rounded-full px-4 py-2 font-semibold text-sm transition-colors duration-200 ${activeTab === "collegeList" ? "bg-amber-500 text-black" : "text-white hover:bg-slate-800"}`}
          onClick={() => setActiveTab("collegeList")}
          type="button"
        >
          Minha College List
        </button>
      </div>

      {activeTab === "favorites" ? (
        <ProfileOpportunities
          favoriteOpportunities={favoriteOpportunities}
          handleRemoveFromList={handleRemoveFromList}
        />
      ) : (
        <ProfileCollegeList
          applicationChecklist={applicationChecklist}
          handleRemoveFromList={handleRemoveFromList}
          myCollegeList={myCollegeList}
          setApplicationChecklist={setApplicationChecklist}
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
