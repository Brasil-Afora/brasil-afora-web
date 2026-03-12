import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  FaBookOpen,
  FaBriefcase,
  FaChevronDown,
  FaChevronUp,
  FaDollarSign,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPercent,
  FaStar,
  FaUserGraduate,
} from "react-icons/fa"
import { RiHeartFill, RiHeartLine } from "react-icons/ri"
import useLocalStorage from "../../hooks/use-local-storage"
import ConfirmationPopup from "./confirmation-popup"
import type { University } from "./types"

interface PopupState {
  message: string
  visible: boolean
}

interface ConfirmationPopupState {
  university: University | null
  visible: boolean
}

const getBorderColorClass = (acceptanceRate: string): string => {
  const rate = Number(acceptanceRate.replace("%", ""))
  if (rate <= 5) {
    return "border-red-500"
  }
  if (rate <= 10) {
    return "border-orange-500"
  }
  if (rate <= 20) {
    return "border-yellow-500"
  }
  if (rate <= 50) {
    return "border-blue-500"
  }
  if (rate <= 100) {
    return "border-green-500"
  }
  return "border-slate-900"
}

const getAcceptanceRateTextColor = (acceptanceRate: string): string => {
  const rate = Number(acceptanceRate.replace("%", ""))
  if (rate <= 5) {
    return "text-red-500"
  }
  if (rate <= 10) {
    return "text-orange-500"
  }
  if (rate <= 20) {
    return "text-yellow-500"
  }
  if (rate <= 50) {
    return "text-blue-500"
  }
  if (rate <= 100) {
    return "text-green-500"
  }
  return "text-white"
}

const formatData = (value: string | number | null | undefined): string => {
  if (
    value === null ||
    value === undefined ||
    value === "N/A" ||
    value === ""
  ) {
    return "N/A"
  }
  if (typeof value === "string") {
    const num = Number(value.replace(/[^0-9.]/g, ""))
    if (!Number.isNaN(num) && value.includes("$")) {
      return `$${num.toLocaleString("pt-BR")}`
    }
    if (!Number.isNaN(num) && value.includes("%")) {
      return `${num}%`
    }
  }
  if (typeof value === "number") {
    return value.toLocaleString("pt-BR")
  }
  return value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
}

const renderInfoItem = (
  label: string,
  value: string | number | null | undefined
): ReactNode => {
  const formattedValue = formatData(value)
  if (formattedValue === "N/A") {
    return null
  }
  return (
    <div className="col-span-1 flex flex-col items-start gap-1 rounded-md bg-slate-800 p-2 md:col-span-1">
      <span className="font-medium text-amber-500 text-xs">{label}</span>
      <span className="font-semibold text-sm text-white">{formattedValue}</span>
    </div>
  )
}

const renderMultiLineItem = (
  icon: ReactNode,
  label: string,
  value: string | null | undefined
): ReactNode => {
  const formattedValue = value ? value.split(", ").join(", ") : "N/A"
  if (formattedValue === "N/A") {
    return null
  }
  return (
    <div className="col-span-1 flex flex-col items-start gap-1 rounded-md bg-slate-800 p-2 md:col-span-1">
      <span className="flex items-center gap-1 font-medium text-amber-500 text-xs">
        {icon} {label}
      </span>
      <span className="text-sm text-white">{formattedValue}</span>
    </div>
  )
}

const renderIconInfo = (
  icon: ReactNode,
  label: string,
  value: string | number | null | undefined
): ReactNode => {
  const formattedValue = formatData(value)
  if (formattedValue === "N/A") {
    return null
  }
  return (
    <div className="col-span-1 flex flex-col items-start gap-1 rounded-md bg-slate-800 p-2 md:col-span-1">
      <span className="flex items-center gap-1 font-medium text-amber-500 text-xs">
        {icon} {label}
      </span>
      <span className="font-semibold text-sm text-white">{formattedValue}</span>
    </div>
  )
}

type ActiveSection = "geral" | "academico" | "custos" | "application"

interface CollegeListProps {
  data: University[]
  onClearFilters: () => void
}

const CollegeList = ({ data, onClearFilters }: CollegeListProps) => {
  const [myCollegeList, setMyCollegeList] = useLocalStorage<University[]>(
    "myCollegeList",
    []
  )
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<ActiveSection>("geral")
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    message: "",
  })
  const [confirmationPopup, setConfirmationPopup] =
    useState<ConfirmationPopupState>({ visible: false, university: null })

  useEffect(() => {
    if (popup.visible) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [popup.visible])

  const handleAddOrRemoveFromList = (
    university: University,
    event?: React.MouseEvent
  ) => {
    event?.stopPropagation()
    const isAlreadyAdded = myCollegeList.some((uni) => uni.id === university.id)
    if (isAlreadyAdded) {
      setConfirmationPopup({ visible: true, university })
    } else {
      setMyCollegeList([...myCollegeList, university])
      setPopup({
        visible: true,
        message: `${university.nome} adicionada à sua College List!`,
      })
    }
  }

  const handleConfirmRemove = () => {
    if (confirmationPopup.university) {
      setMyCollegeList(
        myCollegeList.filter(
          (uni) => uni.id !== confirmationPopup.university?.id
        )
      )
      setPopup({
        visible: true,
        message: `${confirmationPopup.university.nome} removida da sua College List.`,
      })
    }
    setConfirmationPopup({ visible: false, university: null })
  }

  const handleCancelRemove = () => {
    setConfirmationPopup({ visible: false, university: null })
  }

  const handleToggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id)
    if (expandedCardId !== id) {
      setActiveSection("geral")
    }
  }

  const handleSectionToggle = (
    section: ActiveSection,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()
    setActiveSection(section)
  }

  return (
    <div className="p-4 sm:p-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 font-inter">
          {data.length > 0 ? (
            data.map((uni) => {
              const isExpanded = expandedCardId === uni.id
              const isAlreadyAdded = myCollegeList.some(
                (item) => item.id === uni.id
              )

              return (
                <button
                  className={`relative w-full rounded-lg border-2 bg-slate-900 text-left shadow-lg ${getBorderColorClass(uni.taxaAceitacao)} transform cursor-pointer transition-all duration-300 hover:scale-[1.01]`}
                  key={uni.id}
                  onClick={() => handleToggleExpand(uni.id)}
                  type="button"
                >
                  <div className="flex w-full flex-col p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="grow">
                        <h2 className="font-semibold text-white text-xl">
                          {uni.nome}
                        </h2>
                        <div className="mt-1 flex items-center gap-2 text-white">
                          <FaMapMarkerAlt className="h-4 w-4 text-amber-500" />
                          <p className="text-sm">
                            {uni.cidade}, {uni.estado}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`rounded-full p-2 transition-colors duration-300 ${isAlreadyAdded ? "text-amber-500 hover:text-white" : "text-slate-500 hover:text-amber-500"}`}
                        onClick={(e) => handleAddOrRemoveFromList(uni, e)}
                        type="button"
                      >
                        {isAlreadyAdded ? (
                          <RiHeartFill className="h-6 w-6" />
                        ) : (
                          <RiHeartLine className="h-6 w-6" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-2 items-center gap-4 text-sm sm:grid-cols-4">
                      <div className="flex-1">
                        <span className="font-semibold text-amber-500">
                          Aceitação:
                        </span>
                        <p
                          className={`text-sm ${getAcceptanceRateTextColor(uni.taxaAceitacao)} mt-1`}
                        >
                          {uni.taxaAceitacao}
                        </p>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-500">
                          Anuidade:
                        </span>
                        <p className="mt-1 text-sm text-white">
                          {formatData(uni.tuition)}
                        </p>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-500">
                          Ranking:
                        </span>
                        <p className="mt-1 text-sm text-white">
                          {formatData(uni.rankingNacional)}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-amber-500">
                          Alunos:
                        </span>
                        <div className="flex w-full items-center justify-between">
                          <p className="font-semibold text-sm text-white">
                            {formatData(uni.totalAlunos)}
                          </p>
                          <div className="flex items-center gap-2 text-white opacity-70">
                            {isExpanded ? (
                              <FaChevronUp className="h-4 w-4" />
                            ) : (
                              <FaChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-slate-950 border-t p-6 pt-0">
                      <div className="mt-2 mb-4 flex flex-wrap justify-center gap-2">
                        {(
                          [
                            "geral",
                            "academico",
                            "custos",
                            "application",
                          ] as ActiveSection[]
                        ).map((section) => (
                          <button
                            className={`rounded-lg px-4 py-2 font-semibold text-sm transition-colors ${activeSection === section ? "bg-amber-500 text-black" : "bg-slate-800 text-white hover:bg-slate-700"}`}
                            key={section}
                            onClick={(e) => handleSectionToggle(section, e)}
                            type="button"
                          >
                            {
                              (
                                {
                                  geral: "Geral",
                                  academico: "Acadêmico",
                                  custos: "Custos e Bolsas",
                                  application: "Application",
                                } as Record<string, string>
                              )[section]
                            }
                          </button>
                        ))}
                      </div>

                      {activeSection === "geral" && (
                        <div className="grid gap-4 rounded-lg border border-slate-900 bg-slate-950 p-4 shadow-inner md:grid-cols-2">
                          {renderIconInfo(
                            <FaMapMarkerAlt />,
                            "Localização",
                            `${uni.cidade}, ${uni.estado}`
                          )}
                          {renderInfoItem("Tipo de Campus", uni.setting)}
                          {renderIconInfo(
                            <FaUserGraduate />,
                            "Total de Alunos",
                            uni.totalAlunos
                          )}
                          {renderInfoItem(
                            "Taxa de Graduação (4 anos)",
                            uni.graduationRate4anos
                          )}
                          {renderInfoItem(
                            "Salário Mediano (6 anos)",
                            uni.medianSalary6anos
                          )}
                          {renderMultiLineItem(
                            <FaStar />,
                            "Cursos Populares",
                            uni.majorsPrincipais
                          )}
                        </div>
                      )}

                      {activeSection === "academico" && (
                        <div className="grid gap-4 rounded-lg border border-slate-900 bg-slate-950 p-4 shadow-inner md:grid-cols-2">
                          {renderIconInfo(
                            <FaBookOpen />,
                            "Faixa de SAT",
                            uni.faixaSAT
                          )}
                          {renderIconInfo(
                            <FaBriefcase />,
                            "Faixa de ACT",
                            uni.faixaACT
                          )}
                          {renderMultiLineItem(
                            <FaGraduationCap />,
                            "Testes de Proficiência",
                            uni.testesProficiencia
                          )}
                          {renderInfoItem(
                            "Pode-se Transferir?",
                            uni.creditTransfer
                          )}
                        </div>
                      )}

                      {activeSection === "custos" && (
                        <div className="grid gap-4 rounded-lg border border-slate-900 bg-slate-950 p-4 shadow-inner md:grid-cols-2">
                          {renderIconInfo(
                            <FaDollarSign />,
                            "Anuidade",
                            uni.tuition
                          )}
                          {renderInfoItem(
                            "Custo de Moradia/Alimentação",
                            uni.roomBoard
                          )}
                          {renderInfoItem(
                            "Custo Médio Pós-Auxílio",
                            uni.averageCostAfterAid
                          )}
                          {renderInfoItem(
                            "Pacote de Auxílio Médio",
                            uni.averageNeedBasedAidPackage
                          )}
                          {renderInfoItem(
                            "Política Financeira",
                            uni.politicaFinanceira
                          )}
                        </div>
                      )}

                      {activeSection === "application" && (
                        <div className="grid gap-4 rounded-lg border border-slate-900 bg-slate-950 p-4 shadow-inner md:grid-cols-2">
                          {renderIconInfo(
                            <FaPercent />,
                            "Taxa de Aceitação",
                            uni.taxaAceitacao
                          )}
                          {renderInfoItem(
                            "Taxa de Inscrição",
                            uni.applicationFee
                          )}
                          {renderMultiLineItem(
                            null,
                            "Plataforma de Inscrição",
                            uni.plataformaInscricao
                          )}
                          {renderMultiLineItem(
                            null,
                            "Modalidades de Aplicação",
                            uni.tiposAplicacao
                          )}
                          {renderInfoItem("Contato", uni.contato)}
                          <div className="col-span-1 flex flex-col items-start gap-1 rounded-md bg-slate-800 p-2 md:col-span-1">
                            <span className="font-medium text-amber-500 text-xs">
                              Visitar Site
                            </span>
                            <a
                              className="flex items-center gap-1 font-semibold text-sm text-white hover:underline"
                              href={uni.link}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <FaExternalLinkAlt className="h-3 w-3" /> Site
                              Oficial
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )
            })
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 py-20 text-center">
              <img
                alt="Nenhuma oportunidade encontrada"
                className="mb-6 h-20 w-auto opacity-70"
                height={80}
                src="/logo.png"
                width={80}
              />
              <h2 className="mb-2 font-semibold text-2xl text-white">
                Nenhuma universidade encontrada
              </h2>
              <p className="mb-6 text-sm text-white">
                Tente ajustar seus filtros para ver mais resultados.
              </p>
              <button
                className="rounded-full bg-amber-500 px-8 py-3 font-bold text-black transition-colors duration-200 hover:bg-amber-600"
                onClick={onClearFilters}
                type="button"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {popup.visible && (
        <div className="fixed right-4 bottom-4 z-999 flex animate-slideIn items-center gap-4 rounded-lg border border-slate-950 bg-slate-900 p-4 text-white shadow-lg">
          <span>{popup.message}</span>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => setPopup((prev) => ({ ...prev, visible: false }))}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      <ConfirmationPopup
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        university={confirmationPopup.university}
        visible={confirmationPopup.visible}
      />
    </div>
  )
}

export default CollegeList
