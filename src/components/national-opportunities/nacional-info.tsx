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
import { useNavigate, useParams } from "react-router-dom"
import useLocalStorage from "../../hooks/use-local-storage"
import { getTimeRemaining } from "../../lib/date-utils"
import { oportunidadesNacionais } from "../../utils/opportunities-national"
import type { FavoriteOpportunity } from "../profile/types"
import NacionalConfirmationPopup from "./nacional-confirmation-popup"
import type { Opportunity } from "./types"

type ActiveTab = "sobre" | "requisitos" | "custos-bolsas" | "inscricao"

interface PopupState {
  message: string
  visible: boolean
}

const NacionalInfo = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const oportunidade = oportunidadesNacionais.find(
    (op: Opportunity) => op.id === Number(id)
  ) as Opportunity | undefined

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

  const isFavorited = favorites.some(
    (fav) =>
      fav.categoria === "nacional" &&
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
          categoria: "nacional",
          detalhePath: `/oportunidades/nacionais/${oportunidade.id}`,
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
            !(fav.categoria === "nacional" && fav.id === confirmationOpportunity.id)
        )
      )
      setPopup({
        visible: true,
        message: "Oportunidade removida dos seus Favoritos.",
      })
    }
    setConfirmationOpportunity(null)
  }

  if (!oportunidade) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-xl">Oportunidade não encontrada.</p>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao)

  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "sobre",
      label: "Sobre",
      icon: <FaInfoCircle className="mr-2 inline-block" />,
    },
    {
      key: "requisitos",
      label: "Requisitos",
      icon: <FaFileAlt className="mr-2 inline-block" />,
    },
    {
      key: "custos-bolsas",
      label: "Custos e Bolsas",
      icon: <FaMoneyBillWave className="mr-2 inline-block" />,
    },
    {
      key: "inscricao",
      label: "Inscrição",
      icon: <FaPaperclip className="mr-2 inline-block" />,
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "sobre":
        return (
          <div className="rounded-lg border border-slate-950 bg-slate-900 p-8 shadow-xl">
            <h2 className="mb-4 font-bold text-2xl text-amber-500">
              Sobre
            </h2>
            <p className="mb-6 text-base text-white leading-relaxed">
              {oportunidade.sobre || "N/A"}
            </p>
            <p className="mb-6 text-base text-white leading-relaxed">
              {oportunidade.descricaoBreve || "N/A"}
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
                  <p className="text-white">{oportunidade.requisitos || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaClipboardList className="mt-1 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-500">Instituição Responsável</p>
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
                  <p className="text-white">{oportunidade.beneficios || "N/A"}</p>
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
          alt={`Imagem de Capa para ${oportunidade.nome}`}
          className="absolute inset-0 h-full w-full object-cover"
          height={384}
          onError={(e) => {
            e.currentTarget.src = "/home.png"
          }}
          src={oportunidade.imagem}
          width={1280}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-70 p-8 pb-12 md:p-16 md:pb-24">
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-amber-500 px-3 py-1 font-semibold text-black text-xs">
            {oportunidade.tipo}
          </span>
          <h1 className="font-extrabold text-2xl text-white md:text-5xl">
            {oportunidade.nome}
          </h1>
        </div>
      </div>

      <div className="container relative z-10 mx-auto -mt-8 px-4">
        <div className="mb-8 flex flex-col rounded-xl border border-slate-950 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <button
            className="hidden items-center text-amber-500 transition-colors hover:text-amber-600 md:flex"
            onClick={() => navigate(-1)}
            type="button"
          >
            <FaChevronLeft className="mr-2" /> Voltar
          </button>
          <div className="mb-4 flex w-full items-center justify-between md:hidden">
            <button
              className="flex items-center text-amber-500 transition-colors hover:text-amber-600"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FaChevronLeft className="mr-2" /> Voltar
            </button>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
            {timeRemaining && (
              <span className="rounded-full bg-amber-500 px-4 py-1 font-bold text-black text-sm">
                {timeRemaining}
              </span>
            )}
            <button
              className={`flex items-center justify-center rounded-full px-6 py-2 font-bold transition-colors duration-200 ${isFavorited ? "bg-amber-500 text-black" : "bg-slate-950 text-white hover:bg-slate-800"}`}
              onClick={handleFavoriteToggle}
              type="button"
            >
              <FaHeart
                className={`mr-2 ${isFavorited ? "text-black" : "text-amber-500"}`}
              />
              {isFavorited ? "Remover" : "Adicionar aos Favoritos"}
            </button>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-2 font-bold text-black transition-colors duration-300 hover:bg-amber-600"
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
              <button
                className={`rounded-full px-4 py-2 font-bold text-sm transition-colors md:text-base ${activeTab === key ? "bg-amber-500 text-black" : "bg-slate-900 text-white hover:bg-slate-800"}`}
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

      <NacionalConfirmationPopup
        onCancel={() => setConfirmationOpportunity(null)}
        onConfirm={handleConfirmRemove}
        opportunity={confirmationOpportunity}
      />
    </div>
  )
}

export default NacionalInfo
