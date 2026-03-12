import { useState } from "react"
import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import useLocalStorage from "../../hooks/use-local-storage"
import { getTimeRemaining } from "../../lib/date-utils"
import type { Opportunity } from "../opportunities/types"

interface ChecklistItem {
  completed: boolean
  text: string
}

type OpportunitiesChecklist = Record<number, ChecklistItem[]>

interface DeleteState {
  itemIndex: number
  oportunidadeId: number
}

interface ProfileOpportunitiesProps {
  favoriteOpportunities: Opportunity[]
  handleRemoveFromList: (id: number, listName: string, name: string) => void
}

const ProfileOpportunities = ({
  favoriteOpportunities,
  handleRemoveFromList,
}: ProfileOpportunitiesProps) => {
  const [expandedOportunidadeId, setExpandedOportunidadeId] = useState<
    number | null
  >(null)
  const [checklistItems, setChecklistItems] =
    useLocalStorage<OpportunitiesChecklist>("oportunidadesChecklist", {})
  const [customItem, setCustomItem] = useState("")
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteState | null>(null)

  const handleToggleExpand = (id: number) => {
    setExpandedOportunidadeId(expandedOportunidadeId === id ? null : id)
    setShowAddMenu(null)
  }

  const handleAddItem = (oportunidadeId: number, itemText: string) => {
    if (itemText.trim() === "") {
      return
    }
    setChecklistItems((prev) => ({
      ...prev,
      [oportunidadeId]: [
        ...(prev[oportunidadeId] || []),
        { text: itemText, completed: false },
      ],
    }))
    setCustomItem("")
    setShowAddMenu(null)
  }

  const handleChecklistItem = (oportunidadeId: number, itemIndex: number) => {
    setChecklistItems((prev) => {
      const checklist = [...(prev[oportunidadeId] || [])]
      checklist[itemIndex] = {
        ...checklist[itemIndex],
        completed: !checklist[itemIndex].completed,
      }
      return { ...prev, [oportunidadeId]: checklist }
    })
  }

  const handleDeleteItem = (oportunidadeId: number, itemIndex: number) => {
    setDeleteConfirmation({ oportunidadeId, itemIndex })
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirmation) {
      return
    }
    const { oportunidadeId, itemIndex } = deleteConfirmation
    setChecklistItems((prev) => {
      const checklist = [...(prev[oportunidadeId] || [])]
      checklist.splice(itemIndex, 1)
      return { ...prev, [oportunidadeId]: checklist }
    })
    setDeleteConfirmation(null)
  }

  return (
    <div>
      <h2 className="mb-4 font-bold text-3xl text-amber-500">
        Intercâmbios Salvos
      </h2>
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {favoriteOpportunities.length > 0 ? (
          favoriteOpportunities.map((oportunidade) => {
            const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao)
            const isExpanded = expandedOportunidadeId === oportunidade.id
            const items = checklistItems[oportunidade.id] || []
            const completedCount = items.filter((item) => item.completed).length
            const totalCount = items.length
            const progressPercentage =
              totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0

            return (
              <div
                className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-950 bg-slate-900 shadow-lg"
                key={oportunidade.id}
              >
                {progressPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 font-bold text-amber-500 text-xs">
                    {progressPercentage}%
                  </div>
                )}
                {timeRemaining && (
                  <div className="absolute top-4 right-4 z-10 rounded-full bg-amber-500 px-3 py-1 font-bold text-black text-sm">
                    {timeRemaining}
                  </div>
                )}
                <div className="relative h-44">
                  <img
                    alt={`Capa de ${oportunidade.nome}`}
                    className="h-full w-full object-cover"
                    height={176}
                    src={oportunidade.imagem}
                    width={400}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black to-transparent p-4">
                    <h3 className="line-clamp-2 font-bold text-lg text-white leading-tight">
                      {oportunidade.nome}
                    </h3>
                  </div>
                </div>
                <div className="flex grow flex-col p-4 text-white">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-5 text-sm">
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-amber-500" />
                        <span className="font-semibold text-amber-500">
                          País:
                        </span>
                      </div>
                      <span>{oportunidade.pais}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-amber-500" />
                        <span className="font-semibold text-amber-500">
                          Prazo:
                        </span>
                      </div>
                      <span>{oportunidade.prazoInscricao}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      className="rounded-full bg-slate-950 px-4 py-2 text-center font-bold text-amber-500 text-sm transition-colors duration-200 hover:bg-slate-800"
                      to={`/oportunidades/${oportunidade.id}`}
                    >
                      Ver Detalhes
                    </Link>
                    <div className="flex items-center space-x-2">
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-red-500 transition-colors duration-200 hover:bg-slate-800"
                        onClick={() =>
                          handleRemoveFromList(
                            oportunidade.id,
                            "favorites",
                            oportunidade.nome
                          )
                        }
                        title="Remover dos favoritos"
                        type="button"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition-colors duration-200 hover:bg-slate-800"
                        onClick={() => handleToggleExpand(oportunidade.id)}
                        title="Ver checklist"
                        type="button"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 border-slate-950 border-t pt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-bold text-amber-500">
                          Checklist{" "}
                          <span className="font-normal text-white">
                            ({completedCount}/{totalCount})
                          </span>
                        </h4>
                        <button
                          className="rounded-full bg-slate-950 p-2 text-sm text-white hover:bg-slate-800"
                          onClick={() =>
                            setShowAddMenu(
                              showAddMenu === oportunidade.id
                                ? null
                                : oportunidade.id
                            )
                          }
                          type="button"
                        >
                          {showAddMenu === oportunidade.id ? (
                            <FaChevronUp />
                          ) : (
                            <FaPlus />
                          )}
                        </button>
                      </div>
                      <p className="mb-4 text-sm text-white">
                        Acompanhe suas tarefas de aplicação para esta
                        oportunidade.
                      </p>
                      {showAddMenu === oportunidade.id && (
                        <div className="mb-4 flex gap-2">
                          <input
                            className="flex-1 rounded-md border border-slate-900 bg-slate-950 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            onChange={(e) => setCustomItem(e.target.value)}
                            placeholder="Novo item da checklist"
                            type="text"
                            value={customItem}
                          />
                          <button
                            className="rounded-md bg-amber-500 px-3 py-2 font-bold text-black text-sm"
                            onClick={() =>
                              handleAddItem(oportunidade.id, customItem)
                            }
                            type="button"
                          >
                            Adicionar
                          </button>
                        </div>
                      )}
                      <ul className="space-y-2">
                        {items.map((item, index) => (
                          <li
                            className="flex items-center justify-between rounded-lg border border-slate-900 bg-slate-950 p-3"
                            key={`${oportunidade.id}-${item.text}`}
                          >
                            <div className="flex flex-1 items-center space-x-2">
                              <input
                                checked={item.completed}
                                className="rounded border-slate-900 bg-slate-900 text-amber-500 focus:ring-amber-500"
                                onChange={() =>
                                  handleChecklistItem(oportunidade.id, index)
                                }
                                type="checkbox"
                              />
                              <span
                                className={`text-sm ${item.completed ? "text-white line-through" : "text-white"}`}
                              >
                                {item.text}
                              </span>
                            </div>
                            <button
                              className="text-white transition-colors hover:text-red-500"
                              onClick={() =>
                                handleDeleteItem(oportunidade.id, index)
                              }
                              title="Remover item"
                              type="button"
                            >
                              <FaTimesCircle />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="col-span-full text-center text-white">
            Você ainda não salvou nenhum intercâmbio.
          </p>
        )}
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-md rounded-lg border border-slate-950 bg-slate-900 p-8 text-center shadow-xl">
            <p className="mb-6 text-lg text-white">
              Tem certeza que deseja remover este item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
                onClick={handleConfirmDelete}
                type="button"
              >
                Sim
              </button>
              <button
                className="rounded-full bg-slate-950 px-6 py-2 font-semibold text-white transition-colors hover:bg-slate-800"
                onClick={() => setDeleteConfirmation(null)}
                type="button"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileOpportunities
