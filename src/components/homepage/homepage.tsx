import { useEffect, useState } from "react"
import type { IconType } from "react-icons"
import {
  FaBook,
  FaEnvelope,
  FaGlobeAmericas,
  FaGraduationCap,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import useScrollReveal from "../../hooks/use-scroll-reveal"

interface StatItem {
  label: string
  value: string
}

interface CardItem {
  description: string
  icon: IconType
  title: string
  to: string
}

const statsData: StatItem[] = [
  { value: "15+", label: "Países com oportunidades" },
  { value: "10M+", label: "Em bolsas de estudos" },
  { value: "100+", label: "Faculdades dos EUA" },
  { value: "99%", label: "Das oportunidades disponíveis" },
]

const cardData: CardItem[] = [
  {
    to: "/oportunidades",
    icon: FaGlobeAmericas,
    title: "Oportunidades",
    description:
      "Explore e encontre programas de intercâmbio, estudo e voluntariado com bolsas de estudo em diversas partes do mundo.",
  },
  {
    to: "/mapa",
    icon: FaMapMarkerAlt,
    title: "Mapa Interativo",
    description:
      "Visualize no mapa onde estão localizadas as oportunidades de intercâmbio, filtre por país e descubra seu próximo destino.",
  },
  {
    to: "/college-list",
    icon: FaGraduationCap,
    title: "College List",
    description:
      "Crie e gerencie sua lista de faculdades, com detalhes e uma checklist de aplicação para cada uma.",
  },
  {
    to: "/dicionario",
    icon: FaBook,
    title: "Dicionário",
    description:
      "Entenda os termos e siglas essenciais do universo do intercâmbio e da candidatura internacional.",
  },
]

const Homepage = () => {
  const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.2 })
  const [whyRef, whyVisible] = useScrollReveal({ threshold: 0.1 })
  const [contactRef, contactVisible] = useScrollReveal({ threshold: 0.1 })

  const [statsVisibleItems, setStatsVisibleItems] = useState<number[]>([])
  const [cardsVisibleItems, setCardsVisibleItems] = useState<number[]>([])
  const [contactVisibleItems, setContactVisibleItems] = useState<number[]>([])

  useEffect(() => {
    if (statsVisible) {
      setStatsVisibleItems([])
      const timers = [0, 1, 2, 3].map((_, index) =>
        setTimeout(() => {
          setStatsVisibleItems((prev) => [...prev, index])
        }, index * 100)
      )
      return () => timers.forEach(clearTimeout)
    }
  }, [statsVisible])

  useEffect(() => {
    if (whyVisible) {
      setCardsVisibleItems([])
      const timers = [0, 1, 2, 3].map((_, index) =>
        setTimeout(() => {
          setCardsVisibleItems((prev) => [...prev, index])
        }, index * 150)
      )
      return () => timers.forEach(clearTimeout)
    }
  }, [whyVisible])

  useEffect(() => {
    if (contactVisible) {
      setContactVisibleItems([])
      const timers = [0, 1].map((_, index) =>
        setTimeout(() => {
          setContactVisibleItems((prev) => [...prev, index])
        }, index * 200)
      )
      return () => timers.forEach(clearTimeout)
    }
  }, [contactVisible])

  const baseTransition = "transition-all duration-700 ease-in-out transform"

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-inter text-white">
      {/* Hero Section */}
      <div
        className="relative min-h-screen"
        style={{
          backgroundImage: `url("/home.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 z-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center md:px-8">
          <h1 className="mb-4 font-extrabold text-5xl text-white leading-tight md:text-6xl">
            Sua Jornada para o Mundo <br /> Começa Aqui
          </h1>
          <p className="mb-8 max-w-3xl font-light text-white text-xl md:text-2xl">
            Descubra oportunidades incríveis de intercâmbio, estudo e
            voluntariado pelo mundo. Construa seu passaporte global e transforme
            seu futuro.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="inline-block transform rounded-full bg-amber-500 px-8 py-4 font-bold text-slate-950 text-xl transition-colors duration-300 hover:scale-105 hover:bg-amber-600"
              to="/oportunidades"
            >
              Ver Oportunidades →
            </Link>
            <Link
              className="inline-block transform rounded-full border-2 border-white px-8 py-4 font-bold text-white text-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-950"
              to="/mapa"
            >
              Explorar Mapa
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 px-4 py-16" ref={statsRef}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center text-white sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <div
                className={`${baseTransition} ${statsVisibleItems.includes(index) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                key={stat.label}
              >
                <h3 className="mb-2 font-extrabold text-5xl text-amber-500">
                  {stat.value}
                </h3>
                <p className="font-medium text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-slate-950 px-4 py-24" ref={whyRef}>
        <div className="container mx-auto text-center">
          <h2
            className={`mb-2 font-extrabold text-4xl text-white md:text-5xl ${baseTransition} ${whyVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            Por Que Escolher o Passaporte Global?
          </h2>
          <p
            className={`mx-auto mb-12 max-w-2xl text-lg text-white ${baseTransition} ${whyVisible ? "translate-y-0 opacity-100 delay-200" : "translate-y-10 opacity-0"}`}
          >
            Uma plataforma que une várias ferramentas para sua jornada
            internacional.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {cardData.map((card, index) => {
              const Icon = card.icon
              return (
                <Link
                  className={`block transform transition-transform duration-300 hover:scale-105 ${baseTransition} ${cardsVisibleItems.includes(index) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  key={card.to}
                  to={card.to}
                >
                  <div className="flex h-full flex-col justify-between rounded-xl bg-slate-900 p-8 text-center shadow-lg">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-amber-500">
                      <Icon size={32} />
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-2xl text-amber-500">
                        {card.title}
                      </h3>
                      <p className="text-white">{card.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-slate-900 px-4 py-24" ref={contactRef}>
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div
            className={`text-center md:text-left ${baseTransition} ${contactVisibleItems.includes(0) ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <h2 className="mb-4 font-extrabold text-4xl text-white">
              Fale Conosco
            </h2>
            <p className="mb-8 text-lg text-white">
              Tem alguma sugestão, crítica ou dúvida? Gostaríamos muito de ouvir
              você. Conecte-se conosco através dos nossos canais ou envie uma
              mensagem direta.
            </p>
            <ul className="space-y-4 text-center text-white md:text-left">
              <li className="flex items-center justify-center text-lg md:justify-start">
                <FaEnvelope className="mr-3 text-amber-500" size={24} />
                <a
                  className="transition-colors hover:text-amber-500"
                  href="mailto:contato@passaporteglobal.com"
                >
                  contato@passaporteglobal.com
                </a>
              </li>
              <li className="flex items-center justify-center text-lg md:justify-start">
                <FaPhone className="mr-3 text-amber-500" size={24} />
                <a
                  className="transition-colors hover:text-amber-500"
                  href="tel:+5511999999999"
                >
                  +55 (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center justify-center text-lg md:justify-start">
                <FaInstagram className="mr-3 text-amber-500" size={24} />
                <a
                  className="transition-colors hover:text-amber-500"
                  href="https://instagram.com/passaporteglobal"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @passaporteglobal
                </a>
              </li>
            </ul>
          </div>
          <div
            className={`rounded-xl bg-slate-950 p-8 shadow-lg ${baseTransition} ${contactVisibleItems.includes(1) ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <h3 className="mb-4 text-center font-bold text-2xl text-white">
              Envie uma Mensagem
            </h3>
            <form className="space-y-4">
              <div>
                <input
                  className="w-full rounded-md border-transparent bg-slate-800 px-4 py-3 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  type="text"
                />
              </div>
              <div>
                <input
                  className="w-full rounded-md border-transparent bg-slate-800 px-4 py-3 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  id="email"
                  name="email"
                  placeholder="Seu e-mail"
                  type="email"
                />
              </div>
              <div>
                <textarea
                  className="w-full rounded-md border-transparent bg-slate-800 px-4 py-3 text-sm text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  id="message"
                  name="message"
                  placeholder="Escreva sua mensagem aqui..."
                  rows={3}
                />
              </div>
              <div>
                <button
                  className="inline-block w-full transform rounded-full bg-amber-500 px-6 py-3 font-bold text-slate-950 transition-colors duration-300 hover:scale-105 hover:bg-amber-600"
                  type="submit"
                >
                  Enviar Mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage
