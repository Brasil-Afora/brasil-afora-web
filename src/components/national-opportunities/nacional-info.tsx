import { useEffect, useState } from "react"
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaClipboardList,
  FaDesktop,
  FaDollarSign,
  FaExternalLinkAlt,
  FaFileAlt,
  FaGraduationCap,
  FaHeart,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPaperclip,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useSession } from "../../lib/auth-client"
import {
  getTimeRemaining,
  getTimeRemainingBadgeClass,
} from "../../lib/date-utils"
import {
  addNationalFavorite,
  getNationalFavorites,
  getNationalOpportunityById,
  removeNationalFavorite,
} from "../../lib/opportunities-api"
import NacionalConfirmationPopup from "./nacional-confirmation-popup"
import type { Opportunity } from "./types"

type ActiveTab = "sobre" | "requisitos" | "custos-bolsas" | "inscricao"

const NacionalInfo = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session, isPending: isSessionPending } = useSession()
  const [oportunidade, setOportunidade] = useState<Opportunity | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }
    let cancelled = false

    const fetchData = async () => {
      try {
        const result = await getNationalOpportunityById(id)
        if (!cancelled) {
          if (result) {
            setOportunidade(result)
          } else {
            setFetchError("Oportunidade não encontrada.")
          }
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar oportunidade."
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
  }, [id])

  const [isFavorited, setIsFavorited] = useState(false)
  const [confirmationOpportunity, setConfirmationOpportunity] =
    useState<Opportunity | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>("sobre")
  const [heroImageFailed, setHeroImageFailed] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }
    let cancelled = false

    const checkFavoriteStatus = async () => {
      try {
        const favorites = await getNationalFavorites()
        if (!cancelled) {
          setIsFavorited(favorites.some((fav) => fav.id === id))
        }
      } catch {
        // Ignore errors when checking favorite status
      }
    }

    checkFavoriteStatus()

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (!oportunidade?.imagem) {
      setHeroImageFailed(true)
      return
    }

    const image = new Image()
    image.onload = () => setHeroImageFailed(false)
    image.onerror = () => setHeroImageFailed(true)
    image.src = oportunidade.imagem
  }, [oportunidade?.imagem])

  const redirectToLogin = () => {
    navigate("/login", { state: { from: location } })
  }

  const isUnauthorizedError = (error: unknown): boolean => {
    if (!(error instanceof Error)) {
      return false
    }

    const normalizedMessage = error.message.toLowerCase()
    return (
      normalizedMessage.includes("unauthorized") ||
      normalizedMessage.includes("401")
    )
  }

  const handleFavoriteToggle = async () => {
    if (!oportunidade) {
      return
    }

    if (!(session || isSessionPending)) {
      redirectToLogin()
      return
    }

    if (isFavorited) {
      setConfirmationOpportunity(oportunidade)
    } else {
      try {
        await addNationalFavorite(oportunidade.id)
        setIsFavorited(true)
        toast("Oportunidade adicionada aos seus Favoritos!", {
          action: {
            label: "Ir para perfil",
            onClick: () => navigate("/perfil"),
          },
        })
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectToLogin()
          return
        }

        toast("Erro ao adicionar aos favoritos.")
      }
    }
  }

  const handleConfirmRemove = async () => {
    if (confirmationOpportunity) {
      try {
        await removeNationalFavorite(confirmationOpportunity.id)
        setIsFavorited(false)
        toast("Oportunidade removida dos seus Favoritos.")
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectToLogin()
          return
        }

        toast("Erro ao remover dos favoritos.")
      }
    }
    setConfirmationOpportunity(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-white/60 text-xl">Carregando oportunidade...</p>
      </div>
    )
  }

  if (fetchError || !oportunidade) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-xl">
          {fetchError ?? "Oportunidade não encontrada."}
        </p>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao)
  const deadlineBadgeClass = getTimeRemainingBadgeClass(
    oportunidade.prazoInscricao
  )

  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "sobre",
      label: "Sobre",
      icon: <FaInfoCircle className="mr-2 inline-block" />,
    },
    {
      key: "inscricao",
      label: "Inscrição",
      icon: <FaPaperclip className="mr-2 inline-block" />,
    },
    {
      key: "custos-bolsas",
      label: "Custos e Bolsas",
      icon: <FaMoneyBillWave className="mr-2 inline-block" />,
    },
    {
      key: "requisitos",
      label: "Requisitos",
      icon: <FaFileAlt className="mr-2 inline-block" />,
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "sobre":
        return (
          <div className="rounded-lg border border-slate-950 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 font-bold text-2xl text-amber-500">Sobre</h2>
            <p className="mb-6 text-base text-white leading-relaxed">
              {oportunidade.sobre || "N/A"}
            </p>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              {[
                {
                  icon: <FaDesktop />,
                  label: "Online/Presencial",
                  value: oportunidade.modalidade,
                },
                {
                  icon: <FaGraduationCap />,
                  label: "Nível de Ensino",
                  value: oportunidade.nivelEnsino,
                },
                {
                  icon: <FaUser />,
                  label: "Faixa Etária",
                  value: oportunidade.faixaEtaria,
                },
                {
                  icon: <FaMapMarkerAlt />,
                  label: "Cidade/Estado",
                  value: oportunidade.cidadeEstado,
                },
                {
                  icon: <FaInfoCircle />,
                  label: "Duração",
                  value: oportunidade.duracao,
                },
              ].map(({ icon, label, value }) => (
                <div className="flex items-center space-x-3" key={label}>
                  <span className="shrink-0 text-amber-500">{icon}</span>
                  <div>
                    <p className="font-semibold text-amber-500">{label}</p>
                    <p className="text-white">{value || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "requisitos":
        return (
          <div className="rounded-lg border border-slate-950 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 font-bold text-2xl text-amber-500">
              Requisitos
            </h2>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <FaFileAlt className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">Requisitos</p>
                  <p className="text-white">
                    {oportunidade.requisitos || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaClipboardList className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">
                    Instituição Responsável
                  </p>
                  <p className="text-white">
                    {oportunidade.instituicaoResponsavel || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-slate-950 bg-slate-950 p-4">
              <p className="mb-2 font-semibold text-amber-500">
                Requisitos Específicos
              </p>
              {oportunidade.requisitosEspecificos.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-white">
                  {oportunidade.requisitosEspecificos.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">N/A</p>
              )}
            </div>
          </div>
        )
      case "custos-bolsas":
        return (
          <div className="rounded-lg border border-slate-950 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 font-bold text-2xl text-amber-500">
              Benefícios e Custos
            </h2>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <FaDollarSign className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">
                    Taxa de Aplicação
                  </p>
                  <p className="text-white">
                    {oportunidade.taxaAplicacao || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaMoneyBillWave className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">Benefícios</p>
                  <p className="text-white">
                    {oportunidade.beneficios || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaClipboardList className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">Custos</p>
                  <p className="text-white">{oportunidade.custos || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaTimesCircle className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">Custos Extras</p>
                  <p className="text-white">
                    {oportunidade.custosExtras || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      case "inscricao":
        return (
          <div className="rounded-lg border border-slate-950 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 font-bold text-2xl text-amber-500">
              Inscrição
            </h2>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              {[
                {
                  icon: <FaCalendarAlt className="mt-1" />,
                  label: "Prazo de Inscrição",
                  value: oportunidade.prazoInscricao,
                  isLink: false,
                },
                {
                  icon: <FaClipboardList className="mt-1" />,
                  label: "Etapas de Seleção",
                  value: oportunidade.etapasSelecao,
                  isLink: false,
                },
                {
                  icon: <FaPaperclip className="mt-1" />,
                  label: "Contato",
                  value: oportunidade.contato,
                  isLink: false,
                },
              ].map(({ icon, label, value }) => (
                <div className="flex items-start space-x-3" key={label}>
                  <span className="shrink-0 text-amber-500">{icon}</span>
                  <div>
                    <p className="font-semibold text-amber-500">{label}</p>
                    <p className="text-white">{value || "N/A"}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start space-x-3">
                <FaExternalLinkAlt className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">Link Oficial</p>
                  <a
                    className="text-amber-500 hover:underline"
                    href={oportunidade.linkOficial}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {oportunidade.linkOficial || "N/A"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 font-inter text-white">
      <div className="relative h-96 overflow-hidden">
        <img
          alt="Imagem de capa padrão"
          className="absolute inset-0 h-full w-full object-cover"
          height={1080}
          src="/map.jpg"
          width={1920}
        />
        {!heroImageFailed && oportunidade.imagem && (
          <img
            alt={`Imagem de Capa para ${oportunidade.nome}`}
            className="absolute inset-0 h-full w-full object-cover"
            height={1080}
            src={oportunidade.imagem}
            width={1920}
          />
        )}
        <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-8 pb-12 md:p-16 md:pb-24">
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-amber-500 px-3 py-1 font-semibold text-black text-xs">
            {oportunidade.tipo}
          </span>
          <h1 className="font-extrabold text-2xl text-white md:text-5xl">
            {oportunidade.nome}
          </h1>
          {timeRemaining && (
            <span
              className={`mt-3 inline-flex w-fit rounded-full px-4 py-1 font-bold text-sm ${deadlineBadgeClass}`}
            >
              {timeRemaining}
            </span>
          )}
        </div>
      </div>

      <div className="container relative z-10 mx-auto -mt-8 px-4">
        <div className="mb-8 flex flex-col rounded-xl border border-slate-950 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <Button
            className="hidden items-center text-amber-500 transition-colors hover:text-amber-600 md:flex"
            onClick={() => navigate(-1)}
            type="button"
            variant="ghost"
          >
            <FaChevronLeft className="mr-2" /> Voltar
          </Button>
          <div className="mb-4 flex w-full items-center justify-between md:hidden">
            <Button
              className="flex items-center text-amber-500 transition-colors hover:text-amber-600"
              onClick={() => navigate(-1)}
              type="button"
              variant="ghost"
            >
              <FaChevronLeft className="mr-2" /> Voltar
            </Button>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
            <Button
              className={`inline-flex h-11 min-w-[248px] items-center justify-center rounded-full px-6 py-2 font-bold transition-colors duration-200 ${isFavorited ? "bg-amber-500 text-black" : "bg-slate-950 text-white hover:bg-slate-800"}`}
              onClick={handleFavoriteToggle}
              type="button"
              variant="ghost"
            >
              <FaHeart
                className={`mr-2 ${isFavorited ? "text-black" : "text-amber-500"}`}
              />
              {isFavorited ? "Remover" : "Adicionar aos Favoritos"}
            </Button>
            <a
              className="inline-flex h-11 min-w-[248px] items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-2 font-bold text-black transition-colors duration-300 hover:bg-amber-600"
              href={oportunidade.linkOficial || "#"}
              rel="noopener noreferrer"
              target="_blank"
            >
              Inscrever <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>
        </div>

        <div className="py-8">
          <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {tabs.map(({ key, label, icon }) => (
              <Button
                className={`rounded-full px-4 py-2 font-bold text-sm transition-colors md:text-base ${activeTab === key ? "bg-amber-500 text-black" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                key={key}
                onClick={() => setActiveTab(key)}
                type="button"
                variant="ghost"
              >
                {icon} {label}
              </Button>
            ))}
          </div>
          {renderTabContent()}
        </div>
      </div>

      <NacionalConfirmationPopup
        onCancel={() => setConfirmationOpportunity(null)}
        onConfirm={handleConfirmRemove}
        opportunity={confirmationOpportunity}
      />
    </div>
  )
}

export default NacionalInfo
