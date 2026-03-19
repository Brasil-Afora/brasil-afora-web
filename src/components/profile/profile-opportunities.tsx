import { useMemo, useState } from "react"
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaPlus,
  FaThumbtack,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import useLocalStorage from "../../hooks/use-local-storage"
import { getTimeRemaining, getTimeRemainingBadgeClass } from "../../lib/date-utils"
import type { FavoriteOpportunity } from "./types"

interface ChecklistItem {
  completed: boolean
  text: string
}

type OpportunitiesChecklist = Record<string, ChecklistItem[]>

interface DeleteState {
  itemIndex: number
  oportunidadeId: string
}

interface PendingStatusChange {
  nextStatus: ApplicationStatus
  oportunidadeId: string
}

type ApplicationStatus =
  | "Em preparação"
  | "Inscrito"
  | "Aprovado"

type OpportunitiesStatus = Record<string, ApplicationStatus>
type OpportunitiesPinned = Record<string, boolean>

const statusOptions: ApplicationStatus[] = [
  "Em preparação",
  "Inscrito",
  "Aprovado",
]

const parseDeadline = (deadlineString: string): Date | null => {
  if (typeof deadlineString !== "string" || deadlineString.length < 10) {
    return null
  }

  const parts = deadlineString.split("/")
  if (parts.length !== 3) {
    return null
  }

  const day = Number.parseInt(parts[0], 10)
  const month = Number.parseInt(parts[1], 10) - 1
  const year = Number.parseInt(parts[2], 10)

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null
  }

  return new Date(year, month, day)
}

const getDaysUntilDeadline = (deadlineString: string): number | null => {
  const deadline = parseDeadline(deadlineString)
  if (!deadline) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const timeDiff = deadline.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

interface ProfileOpportunitiesProps {
  favoriteOpportunities: FavoriteOpportunity[]
  handleRemoveFromList: (detalhePath: string, name: string) => void
}

const ProfileOpportunities = ({
  favoriteOpportunities,
  handleRemoveFromList,
}: ProfileOpportunitiesProps) => {
  const [expandedOportunidadeId, setExpandedOportunidadeId] = useState<
    string | null
  >(null)
  const [checklistItems, setChecklistItems] =
    useLocalStorage<OpportunitiesChecklist>("oportunidadesChecklist", {})
  const [statusByOpportunity, setStatusByOpportunity] =
    useLocalStorage<OpportunitiesStatus>("oportunidadesStatus", {})
  const [pinnedByOpportunity, setPinnedByOpportunity] =
    useLocalStorage<OpportunitiesPinned>("oportunidadesPinned", {})
  const [customItem, setCustomItem] = useState("")
  const [showAddMenu, setShowAddMenu] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteState | null>(null)
  const [pendingStatusChange, setPendingStatusChange] =
    useState<PendingStatusChange | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        color: ["#f59e0b", "#fbbf24", "#fde68a", "#ffffff"][index % 4],
        delay: Math.random() * 0.5,
        duration: 1.7 + Math.random() * 1.4,
        left: Math.random() * 100,
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 7,
      })),
    []
  )

  const handleToggleExpand = (id: string) => {
    setExpandedOportunidadeId(expandedOportunidadeId === id ? null : id)
    setShowAddMenu(null)
  }

  const handleAddItem = (oportunidadeId: string, itemText: string) => {
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

  const handleChecklistItem = (oportunidadeId: string, itemIndex: number) => {
    setChecklistItems((prev) => {
      const checklist = [...(prev[oportunidadeId] || [])]
      checklist[itemIndex] = {
        ...checklist[itemIndex],
        completed: !checklist[itemIndex].completed,
      }
      return { ...prev, [oportunidadeId]: checklist }
    })
  }

  const handleDeleteItem = (oportunidadeId: string, itemIndex: number) => {
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

  const handleTogglePin = (oportunidadeId: string) => {
    setPinnedByOpportunity((prev) => ({
      ...prev,
      [oportunidadeId]: !prev[oportunidadeId],
    }))
  }

  const handleStatusChange = (
    oportunidadeId: string,
    nextStatus: ApplicationStatus
  ) => {
    setStatusByOpportunity((prev) => ({
      ...prev,
      [oportunidadeId]: nextStatus,
    }))

    if (nextStatus === "Aprovado") {
      setShowCelebration(true)
      window.setTimeout(() => {
        setShowCelebration(false)
      }, 2400)
    }
  }

  const handleRequestStatusChange = (
    oportunidadeId: string,
    nextStatus: ApplicationStatus
  ) => {
    setPendingStatusChange({ oportunidadeId, nextStatus })
  }

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) {
      return
    }

    handleStatusChange(
      pendingStatusChange.oportunidadeId,
      pendingStatusChange.nextStatus
    )
    setPendingStatusChange(null)
  }

  const sortedFavoriteOpportunities = [...favoriteOpportunities].sort((a, b) => {
    const statusA = statusByOpportunity[a.id] ?? "Em preparação"
    const statusB = statusByOpportunity[b.id] ?? "Em preparação"
    const isAppliedA = statusA === "Inscrito"
    const isAppliedB = statusB === "Inscrito"

    if (isAppliedA !== isAppliedB) {
      return isAppliedA ? 1 : -1
    }

    const isPinnedA = Boolean(pinnedByOpportunity[a.id])
    const isPinnedB = Boolean(pinnedByOpportunity[b.id])

    if (isPinnedA !== isPinnedB) {
      return isPinnedA ? -1 : 1
    }

    const dateA = parseDeadline(a.prazoInscricao)
    const dateB = parseDeadline(b.prazoInscricao)

    if (!dateA && !dateB) {
      return a.nome.localeCompare(b.nome)
    }
    if (!dateA) {
      return 1
    }
    if (!dateB) {
      return -1
    }

    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div>
      <style>
        {`@keyframes confetti-fall { 0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(120vh) rotate(540deg); opacity: 0; } }`}
      </style>
      {showCelebration && (
        <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
          {confettiPieces.map((piece, index) => (
            <span
              className="absolute rounded-sm"
              key={`confetti-${index}-${piece.left}`}
              style={{
                animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
                backgroundColor: piece.color,
                height: `${piece.size * 1.4}px`,
                left: `${piece.left}%`,
                top: "-14vh",
                transform: `rotate(${piece.rotate}deg)`,
                width: `${piece.size}px`,
              }}
            />
          ))}
        </div>
      )}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedFavoriteOpportunities.length > 0 ? (
          sortedFavoriteOpportunities.map((oportunidade) => {
            const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao)
            const daysRemaining = getDaysUntilDeadline(oportunidade.prazoInscricao)
            const deadlineBadgeClass = getTimeRemainingBadgeClass(
              oportunidade.prazoInscricao
            )
            const isExpanded = expandedOportunidadeId === oportunidade.id
            const isPinned = Boolean(pinnedByOpportunity[oportunidade.id])
            const items = checklistItems[oportunidade.id] || []
            const completedCount = items.filter((item) => item.completed).length
            const totalCount = items.length
            const progressPercentage =
              totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0
            const status =
              statusByOpportunity[oportunidade.id] ?? "Em preparação"
            const isApplied = status === "Inscrito"
            const checklistIsIncomplete =
              totalCount > 0 && completedCount < totalCount
            const isDeadlineNear = daysRemaining !== null && daysRemaining <= 7
            const showNearDeadlineWarning = isDeadlineNear && checklistIsIncomplete
            const showSuggestMarkAsApplied =
              totalCount > 0 &&
              progressPercentage === 100 &&
              status !== "Inscrito" &&
              status !== "Aprovado"

            return (
              <div
                className={`relative flex flex-col overflow-hidden rounded-2xl border shadow-lg ${isApplied
                  ? "border-slate-800 bg-slate-950 opacity-90"
                  : "border-slate-950 bg-slate-900"
                  } ${isExpanded ? "h-auto" : "h-[420px]"}`}
                key={oportunidade.id}
              >
                <button
                  className={`absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-200 ${isPinned
                    ? "border-amber-300/90 bg-amber-400/95 text-black shadow-amber-500/40"
                    : "border-slate-600/80 bg-slate-950/90 text-white hover:-translate-y-0.5 hover:bg-slate-800/95"
                    }`}
                  onClick={() => handleTogglePin(oportunidade.id)}
                  title={isPinned ? "Desfixar do topo" : "Fixar no topo"}
                  type="button"
                >
                  <FaThumbtack className="h-4 w-4" />
                </button>
                <div className="absolute top-4 left-16 z-10 flex min-w-[3.3rem] items-center justify-center rounded-xl border border-amber-400/50 bg-slate-950/90 px-2 py-1 font-bold text-[11px] text-amber-400 shadow-lg backdrop-blur-sm">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {progressPercentage}%
                </div>
                {timeRemaining && (
                  <div
                    className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 font-bold text-sm shadow-lg ${deadlineBadgeClass}`}
                  >
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
                  <div className="absolute inset-0 bg-black/70" />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black to-transparent p-4">
                    <h3 className="line-clamp-2 font-bold text-lg text-white leading-tight">
                      {oportunidade.nome}
                    </h3>
                  </div>
                </div>
                <div className="flex grow flex-col p-4 text-white">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-amber-500">Status:</span>
                      <select
                        className="w-[11rem] rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={(e) =>
                          handleRequestStatusChange(
                            oportunidade.id,
                            e.target.value as ApplicationStatus
                          )
                        }
                        value={status}
                      >
                        {statusOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
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
                  <button
                    className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-center font-bold text-black text-sm transition-colors duration-200 hover:bg-amber-600"
                    onClick={() =>
                      handleRequestStatusChange(oportunidade.id, "Inscrito")
                    }
                    type="button"
                  >
                    <FaCheckCircle /> Marcar como aplicado
                  </button>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      className="rounded-full bg-slate-950 px-4 py-2 text-center font-bold text-amber-500 text-sm transition-colors duration-200 hover:bg-slate-800"
                      to={oportunidade.detalhePath}
                    >
                      Ver Detalhes
                    </Link>
                    <div className="flex items-center space-x-2">
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-red-500 transition-colors duration-200 hover:bg-slate-800"
                        onClick={() =>
                          handleRemoveFromList(
                            oportunidade.detalhePath,
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
                        Adicione tarefas para acompanhar sua aplicação.
                      </p>
                      {showNearDeadlineWarning && (
                        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200 text-sm">
                          Você ainda não terminou suas tarefas.
                        </p>
                      )}
                      {showSuggestMarkAsApplied && (
                        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200 text-sm">
                          <p className="mb-2 font-semibold">
                            Marcar como aplicado?
                          </p>
                          <button
                            className="rounded-full bg-emerald-500 px-3 py-1.5 font-bold text-black transition-colors hover:bg-emerald-600"
                            onClick={() =>
                              handleRequestStatusChange(oportunidade.id, "Inscrito")
                            }
                            type="button"
                          >
                            Sim, marcar agora
                          </button>
                        </div>
                      )}
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

      {pendingStatusChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-md rounded-lg border border-slate-950 bg-slate-900 p-8 text-center shadow-xl">
            <p className="mb-6 text-lg text-white">
              Deseja alterar o status para
              {" "}
              <span className="font-bold text-amber-500">
                {pendingStatusChange.nextStatus}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
                onClick={handleConfirmStatusChange}
                type="button"
              >
                Sim
              </button>
              <button
                className="rounded-full bg-slate-950 px-6 py-2 font-semibold text-white transition-colors hover:bg-slate-800"
                onClick={() => setPendingStatusChange(null)}
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
