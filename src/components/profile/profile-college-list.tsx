import type { Dispatch, SetStateAction } from "react"
import { useMemo, useState } from "react"
import {
  FaCheckSquare,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaPlus,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash,
} from "react-icons/fa"
import type { University } from "../college-list/types"

interface ChecklistItem {
  completed: boolean
  text: string
}

type ApplicationChecklist = Record<number, ChecklistItem[]>

type SortCriteria = "taxaAceitacao" | "anuidade" | "indiceAjuda"
type SortDirection = "asc" | "desc"
type ActiveSection = "geral" | "academico" | "custos" | "application"

interface ProfileCollegeListProps {
  applicationChecklist: ApplicationChecklist
  handleRemoveFromList: (id: number, listName: string, name: string) => void
  myCollegeList: University[]
  setApplicationChecklist: Dispatch<SetStateAction<ApplicationChecklist>>
}

interface ConfirmationState {
  isCompleted: boolean
  itemIndex: number
  uniId: number
}

interface DeleteState {
  itemIndex: number
  uniId: number
}

const ProfileCollegeList = ({
  myCollegeList,
  applicationChecklist,
  setApplicationChecklist,
  handleRemoveFromList,
}: ProfileCollegeListProps) => {
  const [expandedDetailsUniId, setExpandedDetailsUniId] = useState<
    number | null
  >(null)
  const [expandedChecklistUniId, setExpandedChecklistUniId] = useState<
    number | null
  >(null)
  const [activeSection, setActiveSection] = useState<ActiveSection>("geral")
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null)
  const [customItem, setCustomItem] = useState("")
  const [completionConfirmation, setCompletionConfirmation] =
    useState<ConfirmationState | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteState | null>(null)
  const [sortCriteria, setSortCriteria] = useState<SortCriteria | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedCollegeList = useMemo(() => {
    if (!sortCriteria) {
      return myCollegeList
    }
    return [...myCollegeList].sort((a, b) => {
      let valA = 0
      let valB = 0
      switch (sortCriteria) {
        case "taxaAceitacao":
          valA = Number.parseFloat(a.taxaAceitacao.replace("%", "")) || 0
          valB = Number.parseFloat(b.taxaAceitacao.replace("%", "")) || 0
          break
        case "anuidade":
          valA = Number.parseFloat(a.tuition.replace(/[^0-9.]/g, "")) || 0
          valB = Number.parseFloat(b.tuition.replace(/[^0-9.]/g, "")) || 0
          break
        case "indiceAjuda":
          valA =
            Number.parseFloat(
              a.averageNeedBasedAidPackage?.replace(/[^0-9.]/g, "") ?? ""
            ) || 0
          valB =
            Number.parseFloat(
              b.averageNeedBasedAidPackage?.replace(/[^0-9.]/g, "") ?? ""
            ) || 0
          break
        default:
          break
      }
      return sortDirection === "asc" ? valA - valB : valB - valA
    })
  }, [myCollegeList, sortCriteria, sortDirection])

  const handleToggleDetails = (id: number) => {
    setExpandedDetailsUniId(expandedDetailsUniId === id ? null : id)
    setExpandedChecklistUniId(null)
    setActiveSection("geral")
  }

  const handleToggleChecklist = (id: number) => {
    setExpandedChecklistUniId(expandedChecklistUniId === id ? null : id)
    setExpandedDetailsUniId(null)
    if (!applicationChecklist[id]) {
      setApplicationChecklist((prev) => ({ ...prev, [id]: [] }))
    }
  }

  const handleSort = (criteria: SortCriteria) => {
    if (criteria === sortCriteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortCriteria(criteria)
      setSortDirection("asc")
    }
  }

  const handleAddItem = (uniId: number, itemText: string) => {
    if (itemText.trim() === "") {
      return
    }
    setApplicationChecklist((prev) => ({
      ...prev,
      [uniId]: [...(prev[uniId] || []), { text: itemText, completed: false }],
    }))
    setCustomItem("")
    setShowAddMenu(null)
  }

  const handleChecklistItem = (uniId: number, itemIndex: number) => {
    const isCompleted = applicationChecklist[uniId][itemIndex].completed
    setCompletionConfirmation({ uniId, itemIndex, isCompleted })
  }

  const handleConfirmCompletion = () => {
    if (!completionConfirmation) {
      return
    }
    const { uniId, itemIndex } = completionConfirmation
    setApplicationChecklist((prev) => {
      const checklist = [...prev[uniId]]
      checklist[itemIndex] = {
        ...checklist[itemIndex],
        completed: !checklist[itemIndex].completed,
      }
      return { ...prev, [uniId]: checklist }
    })
    setCompletionConfirmation(null)
  }

  const handleDeleteItem = (uniId: number, itemIndex: number) => {
    setDeleteConfirmation({ uniId, itemIndex })
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirmation) {
      return
    }
    const { uniId, itemIndex } = deleteConfirmation
    setApplicationChecklist((prev) => {
      const checklist = [...prev[uniId]]
      checklist.splice(itemIndex, 1)
      return { ...prev, [uniId]: checklist }
    })
    setDeleteConfirmation(null)
  }

  const getSortIcon = (criteria: SortCriteria) => {
    if (sortCriteria === criteria) {
      return sortDirection === "asc" ? (
        <FaSortAmountUp className="text-xl" />
      ) : (
        <FaSortAmountDown className="text-xl" />
      )
    }
    return <FaSort className="text-white text-xl" />
  }

  const sortButtons: { criteria: SortCriteria; label: string }[] = [
    { criteria: "taxaAceitacao", label: "Taxa de Aceitação" },
    { criteria: "anuidade", label: "Anuidade" },
    { criteria: "indiceAjuda", label: "Índice de Ajuda" },
  ]

  const mobileSections: { key: ActiveSection; label: string }[] = [
    { key: "geral", label: "Geral" },
    { key: "academico", label: "Acadêmico" },
    { key: "custos", label: "Custos & Bolsas" },
    { key: "application", label: "Application" },
  ]

  const renderDetailsSection = (uni: University) => {
    if (expandedDetailsUniId !== uni.id) {
      return null
    }
    return (
      <div className="mt-4 border-slate-950 border-t pt-4">
        <h4 className="mb-2 font-bold text-amber-500 text-xl">
          Detalhes da Universidade
        </h4>
        <div className="mb-4 flex flex-wrap justify-center gap-2 md:hidden">
          {mobileSections.map(({ key, label }) => (
            <button
              className={`rounded-full px-4 py-2 font-semibold text-sm transition-colors ${activeSection === key ? "bg-amber-500 text-black" : "bg-slate-900 text-white"}`}
              key={key}
              onClick={() => setActiveSection(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden grid-cols-1 gap-8 md:grid lg:grid-cols-4">
          <div>
            <h5 className="mb-2 font-bold text-lg text-white">Geral</h5>
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                { label: "Tipo de Campus", value: uni.setting },
                {
                  label: "Ranking Nacional",
                  value: uni.rankingNacional,
                },
                {
                  label: "Total de Alunos",
                  value: uni.totalAlunos,
                },
                {
                  label: "Percentual de Internacionais",
                  value: uni.percentualInternacionais,
                },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>
          <div>
            <h5 className="mb-2 font-bold text-lg text-white">Acadêmico</h5>
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                {
                  label: "Taxa de Aceitação",
                  value: uni.taxaAceitacao,
                },
                { label: "Faixa de SAT", value: uni.faixaSAT },
                { label: "Faixa de ACT", value: uni.faixaACT },
                {
                  label: "Taxa de Graduação (4 anos)",
                  value: uni.graduationRate4anos,
                },
                {
                  label: "Salário Médio (6 anos)",
                  value: uni.medianSalary6anos,
                },
                {
                  label: "Cursos Populares",
                  value: uni.majorsPrincipais,
                },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>
          <div>
            <h5 className="mb-2 font-bold text-lg text-white">
              Custos & Bolsas
            </h5>
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                { label: "Anuidade", value: uni.tuition },
                {
                  label: "Moradia e Alimentação",
                  value: uni.roomBoard,
                },
                {
                  label: "Custo Médio Pós-Auxílio",
                  value: uni.averageCostAfterAid,
                },
                {
                  label: "Pacote de Auxílio Médio",
                  value: uni.averageNeedBasedAidPackage,
                },
                {
                  label: "Política Financeira",
                  value: uni.politicaFinanceira,
                },
                { label: "Tipos de Bolsa", value: uni.tiposBolsa },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>
          <div>
            <h5 className="mb-2 font-bold text-lg text-white">Application</h5>
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                {
                  label: "Taxa de Inscrição",
                  value: uni.applicationFee,
                },
                {
                  label: "Plataforma de Inscrição",
                  value: uni.plataformaInscricao,
                },
                {
                  label: "Tipos de Aplicação",
                  value: uni.tiposAplicacao,
                },
                {
                  label: "Testes de Proficiência",
                  value: uni.testesProficiencia,
                },
                { label: "Contato", value: uni.contato },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden">
          {activeSection === "geral" && (
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                { label: "Tipo de Campus", value: uni.setting },
                {
                  label: "Ranking Nacional",
                  value: uni.rankingNacional,
                },
                {
                  label: "Total de Alunos",
                  value: uni.totalAlunos,
                },
                {
                  label: "Percentual de Internacionais",
                  value: uni.percentualInternacionais,
                },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          )}
          {activeSection === "academico" && (
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                {
                  label: "Taxa de Aceitação",
                  value: uni.taxaAceitacao,
                },
                { label: "Faixa de SAT", value: uni.faixaSAT },
                { label: "Faixa de ACT", value: uni.faixaACT },
                {
                  label: "Taxa de Graduação (4 anos)",
                  value: uni.graduationRate4anos,
                },
                {
                  label: "Salário Médio (6 anos)",
                  value: uni.medianSalary6anos,
                },
                {
                  label: "Cursos Populares",
                  value: uni.majorsPrincipais,
                },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          )}
          {activeSection === "custos" && (
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                { label: "Anuidade", value: uni.tuition },
                {
                  label: "Moradia e Alimentação",
                  value: uni.roomBoard,
                },
                {
                  label: "Custo Médio Pós-Auxílio",
                  value: uni.averageCostAfterAid,
                },
                {
                  label: "Pacote de Auxílio Médio",
                  value: uni.averageNeedBasedAidPackage,
                },
                {
                  label: "Política Financeira",
                  value: uni.politicaFinanceira,
                },
                { label: "Tipos de Bolsa", value: uni.tiposBolsa },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          )}
          {activeSection === "application" && (
            <div className="flex flex-col gap-1 text-slate-400 text-sm">
              {[
                {
                  label: "Taxa de Inscrição",
                  value: uni.applicationFee,
                },
                {
                  label: "Plataforma de Inscrição",
                  value: uni.plataformaInscricao,
                },
                {
                  label: "Tipos de Aplicação",
                  value: uni.tiposAplicacao,
                },
                {
                  label: "Testes de Proficiência",
                  value: uni.testesProficiencia,
                },
                { label: "Contato", value: uni.contato },
              ].map(({ label, value }) => (
                <p key={label}>
                  <span className="font-semibold text-white">{label}:</span>{" "}
                  <span>{value}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderChecklistSection = (
    uni: University,
    checklistItems: ChecklistItem[],
    completedItems: number,
    totalItems: number
  ) => {
    if (expandedChecklistUniId !== uni.id) {
      return null
    }
    return (
      <div className="mt-4 border-slate-950 border-t pt-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-amber-500 text-xl">
            Checklist da Aplicação
            <span className="ml-2 font-normal text-sm text-white">
              ({completedItems}/{totalItems})
            </span>
          </h4>
        </div>
        <p className="mb-4 text-sm text-white">
          Adicione abaixo todos os documentos e etapas que você precisa enviar
          para sua inscrição.
        </p>
        <div className="mb-4">
          {showAddMenu === uni.id ? (
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <input
                className="flex-1 rounded-md border border-slate-900 bg-slate-900 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="Novo item"
                type="text"
                value={customItem}
              />
              <div className="flex gap-2">
                <button
                  className="whitespace-nowrap rounded-md bg-amber-500 px-3 py-2 font-bold text-black text-sm"
                  onClick={() => handleAddItem(uni.id, customItem)}
                  type="button"
                >
                  Adicionar
                </button>
                <button
                  className="rounded-md bg-slate-900 p-2 text-white transition-colors hover:bg-slate-800"
                  onClick={() => setShowAddMenu(null)}
                  title="Cancelar"
                  type="button"
                >
                  <FaChevronUp />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="rounded-full bg-slate-900 p-2 text-white transition-colors hover:bg-slate-800"
              onClick={() => setShowAddMenu(uni.id)}
              title="Adicionar item"
              type="button"
            >
              <FaPlus />
            </button>
          )}
        </div>
        <ul className="grid grid-cols-1 gap-4 pr-2 sm:grid-cols-2">
          {checklistItems.map((item, itemIndex) => (
            <li
              className={`flex items-start justify-between rounded-lg border border-slate-950 p-3 transition-colors duration-200 ${item.completed ? "bg-slate-950" : "bg-slate-900 hover:bg-slate-800"}`}
              key={`${uni.id}-${item.text}`}
            >
              <button
                className="flex flex-1 cursor-pointer items-start space-x-3 text-left"
                onClick={() => handleChecklistItem(uni.id, itemIndex)}
                type="button"
              >
                <input
                  checked={item.completed}
                  className="mt-1 rounded border-slate-900 bg-slate-950 text-amber-500 focus:ring-amber-500"
                  onChange={() => handleChecklistItem(uni.id, itemIndex)}
                  type="checkbox"
                />
                <span
                  className={`wrap-break-words text-sm ${item.completed ? "text-white line-through" : "text-white"}`}
                >
                  {item.text}
                </span>
              </button>
              <button
                className="ml-2 rounded-full p-1 text-white transition-colors hover:bg-slate-950"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteItem(uni.id, itemIndex)
                }}
                title="Remover item"
                type="button"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="mb-4 font-bold text-3xl text-amber-500">
        Minha College List
      </h2>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="min-w-30 font-semibold text-lg text-white">
          Ordenar por:
        </span>
        {sortButtons.map(({ criteria, label }) => (
          <button
            className={`flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-sm transition-colors duration-200 md:px-4 md:py-2 md:text-base ${sortCriteria === criteria ? "bg-amber-500 text-black" : "bg-slate-900 text-white hover:bg-slate-800"}`}
            key={criteria}
            onClick={() => handleSort(criteria)}
            type="button"
          >
            {label}
            {getSortIcon(criteria)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {sortedCollegeList.length > 0 ? (
          sortedCollegeList.map((uni) => {
            const checklistItems = applicationChecklist[uni.id] || []
            const completedItems = checklistItems.filter(
              (item) => item.completed
            ).length
            const totalItems = checklistItems.length
            const progressPercentage =
              totalItems > 0
                ? Math.round((completedItems / totalItems) * 100)
                : 0

            return (
              <div
                className="flex flex-col gap-4 rounded-lg border border-slate-950 bg-slate-900 p-4 shadow-xl md:p-6"
                key={uni.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 text-white md:flex-row md:items-center">
                      <h3 className="font-bold text-xl md:text-2xl">
                        {uni.nome}
                      </h3>
                      <span className="font-medium text-amber-500 text-base md:text-lg">
                        ({progressPercentage}%)
                      </span>
                    </div>
                    <p className="text-sm text-white md:text-base">
                      {uni.cidade || "N/A"}, {uni.estado || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:ml-auto">
                    <a
                      className="flex items-center rounded-full bg-slate-950 px-4 py-3 text-center font-bold text-amber-500 text-xs transition-transform duration-200 hover:scale-105 hover:bg-slate-800 md:text-sm"
                      href={uni.link}
                      rel="noopener noreferrer"
                      target="_blank"
                      title="Visitar site"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Visitar
                    </a>
                    <button
                      className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 font-bold text-xs transition-colors duration-200 md:text-sm ${expandedDetailsUniId === uni.id ? "bg-amber-500 text-black" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleDetails(uni.id)
                      }}
                      title="Ver detalhes"
                      type="button"
                    >
                      <FaInfoCircle />
                      <span className="hidden md:inline">Detalhes</span>
                      {expandedDetailsUniId === uni.id ? (
                        <FaChevronUp className="md:hidden" />
                      ) : (
                        <FaChevronDown className="md:hidden" />
                      )}
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 font-bold text-xs transition-colors duration-200 md:text-sm ${expandedChecklistUniId === uni.id ? "bg-amber-500 text-black" : "bg-slate-950 text-white hover:bg-slate-800"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleChecklist(uni.id)
                      }}
                      title="Ver checklist"
                      type="button"
                    >
                      <FaCheckSquare />
                      <span className="hidden md:inline">Checklist</span>
                      {expandedChecklistUniId === uni.id ? (
                        <FaChevronUp className="md:hidden" />
                      ) : (
                        <FaChevronDown className="md:hidden" />
                      )}
                    </button>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-red-500 transition-colors duration-200 hover:bg-slate-800"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromList(uni.id, "myCollegeList", uni.nome)
                      }}
                      title="Remover da lista"
                      type="button"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {renderDetailsSection(uni)}

                {renderChecklistSection(
                  uni,
                  checklistItems,
                  completedItems,
                  totalItems
                )}
              </div>
            )
          })
        ) : (
          <p className="col-span-full text-center text-white">
            Sua College List está vazia.
          </p>
        )}
      </div>

      {completionConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-950 bg-slate-900 p-8 text-center shadow-xl">
            <p className="mb-6 text-lg text-white">
              {completionConfirmation.isCompleted
                ? "Tem certeza que deseja marcar esta tarefa como não concluída?"
                : "Essa tarefa foi concluída?"}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
                onClick={handleConfirmCompletion}
                type="button"
              >
                Sim
              </button>
              <button
                className="rounded-full bg-slate-950 px-6 py-2 font-semibold text-white transition-colors hover:bg-slate-800"
                onClick={() => setCompletionConfirmation(null)}
                type="button"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
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

export default ProfileCollegeList
