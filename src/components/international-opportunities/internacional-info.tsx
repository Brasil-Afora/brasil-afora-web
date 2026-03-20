import { useEffect, useState } from "react"
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronLeft,
  FaClipboardList,
  FaClock,
  FaDollarSign,
  FaExternalLinkAlt,
  FaFileAlt,
  FaGlobeAmericas,
  FaGraduationCap,
  FaHeart,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPaperclip,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import useLocalStorage from "../../hooks/use-local-storage"
import { apiFetch } from "../../lib/api"
import { getTimeRemaining, getTimeRemainingBadgeClass } from "../../lib/date-utils"
import type { FavoriteOpportunity } from "../profile/types"
import InternacionalConfirmationPopup from "./internacional-confirmation-popup"
import type { Opportunity } from "./types"

type ActiveTab = "sobre" | "requisitos" | "custos-bolsas" | "inscricao"

interface PopupState {
  message: string
  visible: boolean
}

const getScholarshipTagClasses = (tipoBolsa: string): string => {
  switch (tipoBolsa?.toLowerCase()) {
    case "parcial":
      return "bg-amber-500 text-black"
    case "completa":
      return "bg-green-500 text-black"
    case "sem bolsa":
      return "bg-gray-500 text-black"
    default:
      return "bg-slate-900 text-white"
  }
}

const InternacionalInfo = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
        const result = await apiFetch<Opportunity>(
          `/oportunidades/internacionais/${id}`
        )
        if (!cancelled) {
          setOportunidade(result)
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

  const [favorites, setFavorites] = useLocalStorage<FavoriteOpportunity[]>(
    "favorites",
    []
  )
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    message: "",
  })
  const [confirmationOpportunity, setConfirmationOpportunity] =
    useState<Opportunity | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>("sobre")
  const [heroImageFailed, setHeroImageFailed] = useState(false)

  const isFavorited = favorites.some(
    (fav) =>
      fav.categoria === "internacional" &&
      fav.id === (oportunidade ? oportunidade.id : null)
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (popup.visible) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [popup.visible])

  useEffect(() => {
    setHeroImageFailed(false)
  }, [oportunidade?.imagem])

  const handleFavoriteToggle = () => {
    if (!oportunidade) {
      return
    }
    if (isFavorited) {
      setConfirmationOpportunity(oportunidade)
    } else {
      setFavorites([
        ...favorites,
        {
          id: oportunidade.id,
          nome: oportunidade.nome,
          imagem: oportunidade.imagem,
          pais: oportunidade.pais,
          prazoInscricao: oportunidade.prazoInscricao,
          categoria: "internacional",
          detalhePath: `/oportunidades/internacionais/${oportunidade.id}`,
        },
      ])
      setPopup({
        visible: true,
        message: "Oportunidade adicionada aos seus Favoritos!",
      })
    }
  }

  const handleConfirmRemove = () => {
    if (confirmationOpportunity) {
      setFavorites(
        favorites.filter(
          (fav) =>
            !(
              fav.categoria === "internacional" &&
              fav.id === confirmationOpportunity.id
            )
        )
      )
      setPopup({
        visible: true,
        message: "Oportunidade removida dos seus Favoritos.",
      })
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

  const scholarshipClasses = getScholarshipTagClasses(oportunidade.tipoBolsa)
  const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao)
  const deadlineBadgeClass = getTimeRemainingBadgeClass(oportunidade.prazoInscricao)

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
            <h2 className="mb-4 font-bold text-2xl text-blue-400">
              Sobre o Programa
            </h2>
            <p className="mb-6 text-base text-white leading-relaxed">
              {oportunidade.descricao || "N/A"}
            </p>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              {[
                {
                  icon: <FaGlobeAmericas />,
                  label: "País de Destino",
                  value: oportunidade.pais,
                },
                {
                  icon: <FaMapMarkerAlt />,
                  label: "Cidade",
                  value: oportunidade.cidade,
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
                  icon: <FaClock />,
                  label: "Duração",
                  value: oportunidade.duracao,
                },
              ].map(({ icon, label, value }) => (
                <div className="flex items-center space-x-3" key={label}>
                  <span className="shrink-0 text-blue-400">{icon}</span>
                  <div>
                    <p className="font-semibold text-blue-400">{label}</p>
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
            <h2 className="mb-4 font-bold text-2xl text-blue-400">
              Requisitos e Documentos
            </h2>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              {[
                {
                  icon: <FaFileAlt className="mt-1" />,
                  label: "Requisitos Específicos",
                  value: oportunidade.requisitosEspecificos,
                },
                {
                  icon: <FaGraduationCap className="mt-1" />,
                  label: "Requisitos de Idioma",
                  value: oportunidade.requisitosIdioma,
                },
                {
                  icon: <FaClipboardList className="mt-1" />,
                  label: "Instituição Responsável",
                  value: oportunidade.instituicaoResponsavel,
                },
              ].map(({ icon, label, value }) => (
                <div className="flex items-start space-x-3" key={label}>
                  <span className="shrink-0 text-blue-400">{icon}</span>
                  <div>
                    <p className="font-semibold text-blue-400">{label}</p>
                    <p className="text-white">{value || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "custos-bolsas":
        return (
          <div className="rounded-lg border border-slate-950 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 font-bold text-2xl text-blue-400">
              Custos e Bolsas
            </h2>
            <div className="grid grid-cols-1 gap-6 text-base md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <FaDollarSign className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-400">
                    Taxa de Aplicação
                  </p>
                  <p className="text-white">
                    {oportunidade.taxaAplicacao || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaCheck className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-400">Tipo de Bolsa</p>
                  <span
                    className={`rounded-full px-3 py-1 font-bold text-sm uppercase ${scholarshipClasses}`}
                  >
                    {oportunidade.tipoBolsa || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaMoneyBillWave className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-400">
                    Cobertura da Bolsa
                  </p>
                  <p className="text-white">
                    {oportunidade.coberturaBolsa || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaTimesCircle className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-400">Custos Extras</p>
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
            <h2 className="mb-4 font-bold text-2xl text-blue-400">
              Processo de Inscrição
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
                  label: "Processo de Inscrição",
                  value: oportunidade.processoInscricao,
                  isLink: false,
                },
                {
                  icon: <FaUser className="mt-1" />,
                  label: "Contato",
                  value: oportunidade.contato,
                  isLink: false,
                },
              ].map(({ icon, label, value }) => (
                <div className="flex items-start space-x-3" key={label}>
                  <span className="shrink-0 text-blue-400">{icon}</span>
                  <div>
                    <p className="font-semibold text-blue-400">{label}</p>
                    <p className="text-white">{value || "N/A"}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start space-x-3">
                <FaExternalLinkAlt className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-400">Link Oficial</p>
                  <a
                    className="text-blue-400 hover:underline"
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
          src="/map.jpg"
        />
        {!heroImageFailed && oportunidade.imagem && (
          <img
            alt={`Imagem de Capa para ${oportunidade.nome}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setHeroImageFailed(true)}
            src={oportunidade.imagem}
          />
        )}
        <div className="absolute inset-0 flex flex-col justify-end bg-black/80 p-8 pb-12 md:p-16 md:pb-24">
          <div className="mb-2 flex items-center text-white">
            <FaGlobeAmericas className="mr-2" />
            <span className="font-light text-sm md:text-base">
              {oportunidade.pais}
            </span>
          </div>
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
          <button
            className="hidden items-center text-blue-400 transition-colors hover:text-blue-500 md:flex"
            onClick={() => navigate(-1)}
            type="button"
          >
            <FaChevronLeft className="mr-2" /> Voltar
          </button>
          <div className="mb-4 flex w-full items-center justify-between md:hidden">
            <button
              className="flex items-center text-blue-400 transition-colors hover:text-blue-500"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FaChevronLeft className="mr-2" /> Voltar
            </button>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
            {timeRemaining && (
              <span className="rounded-full bg-blue-500 px-4 py-1 font-bold text-sm text-white">
                {timeRemaining}
              </span>
            )}
            <button
              className={`inline-flex h-11 min-w-[248px] items-center justify-center rounded-full px-6 py-2 font-bold transition-colors duration-200 ${isFavorited ? "bg-blue-500 text-white" : "bg-slate-950 text-white hover:bg-slate-800"}`}
              onClick={handleFavoriteToggle}
              type="button"
            >
              <FaHeart
                className={`mr-2 ${isFavorited ? "text-white" : "text-blue-400"}`}
              />
              {isFavorited ? "Remover" : "Adicionar aos Favoritos"}
            </button>
            <a
              className="inline-flex h-11 min-w-[248px] items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-2 font-bold text-white transition-colors duration-300 hover:bg-blue-600"
              href={oportunidade.linkOficial || "#"}
              rel="noopener noreferrer"
              target="_blank"
            >
              Aplicar agora <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>
        </div>

        <div className="py-8">
          <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {tabs.map(({ key, label, icon }) => (
              <button
                className={`rounded-full px-4 py-2 font-bold text-sm transition-colors md:text-base ${activeTab === key ? "bg-blue-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                key={key}
                onClick={() => setActiveTab(key)}
                type="button"
              >
                {icon} {label}
              </button>
            ))}
          </div>
          {renderTabContent()}
        </div>
      </div>

      {popup.visible && (
        <div className="fixed top-4 right-4 z-50 flex animate-slideIn items-center gap-4 rounded-lg border border-slate-950 bg-slate-900 p-4 text-white shadow-lg">
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

      <InternacionalConfirmationPopup
        onCancel={() => setConfirmationOpportunity(null)}
        onConfirm={handleConfirmRemove}
        opportunity={confirmationOpportunity}
      />
    </div>
  )
}

export default InternacionalInfo
