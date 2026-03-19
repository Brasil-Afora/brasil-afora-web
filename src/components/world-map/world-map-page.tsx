import { useEffect, useMemo, useState } from "react"
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapPin,
  FaTimes,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import useSessionStorage from "../../hooks/use-session-storage"
import { oportunidadesInternacionais } from "../../utils/opportunities-international"
import type { Opportunity } from "../international-opportunities/types"
import WorldMap from "./world-map"

interface CountryInterchange {
  duracao: string
  id: number
  link: string
  nome: string
  prazoInscricao: string
  tipo: string
}

interface CountryData {
  codigo: string
  count: number
  intercambios: CountryInterchange[]
  nome: string
}

const codigosPorPais: Record<string, string> = {
  "Estados Unidos": "US",
  Canadá: "CA",
  "Reino Unido": "GB",
  Alemanha: "DE",
  França: "FR",
  Espanha: "ES",
  Itália: "IT",
  Irlanda: "IE",
  Austrália: "AU",
  "Nova Zelândia": "NZ",
  Japão: "JP",
  "Coreia do Sul": "KR",
  China: "CN",
  Argentina: "AR",
  Chile: "CL",
  México: "MX",
  Suíça: "CH",
  Brasil: "BR",
  Europa: "EU",
  Dinamarca: "DK",
  Suécia: "SE",
  "Países Baixos": "NL",
  Áustria: "AT",
  Tailândia: "TH",
  Singapura: "SG",
  Noruega: "NO",
  "Hong Kong": "HK",
  Diversos: "BR",
}

const getCodigoPais = (nomePais: string): string | undefined =>
  codigosPorPais[nomePais]

const agruparOportunidadesPorPais = (dados: Opportunity[]): CountryData[] => {
  const agrupado: Record<string, CountryData> = {}
  for (const oportunidade of dados) {
    const codigo = getCodigoPais(oportunidade.pais)
    if (codigo) {
      if (!agrupado[codigo]) {
        agrupado[codigo] = {
          nome: oportunidade.pais,
          codigo,
          count: 0,
          intercambios: [],
        }
      }
      agrupado[codigo].count++
      agrupado[codigo].intercambios.push({
        id: oportunidade.id,
        nome: oportunidade.nome,
        tipo: oportunidade.tipo,
        duracao: oportunidade.duracao,
        prazoInscricao: oportunidade.prazoInscricao,
        link: `/oportunidades/internacionais/${oportunidade.id}`,
      })
    }
  }
  return Object.values(agrupado).sort((a, b) => a.nome.localeCompare(b.nome))
}

const WorldMapPage = () => {
  const [clickedCountryData, setClickedCountryData] =
    useSessionStorage<CountryData | null>("mapClickedCountry", null)

  const listaDePaisesComOportunidades = useMemo(
    () =>
      agruparOportunidadesPorPais(oportunidadesInternacionais as Opportunity[]),
    []
  )

  const oportunidadesPorCodigo = useMemo(() => {
    const agrupado: Record<
      string,
      { nome: string; intercambios: Opportunity[] }
    > = {}
    for (const op of oportunidadesInternacionais as Opportunity[]) {
      const codigo = getCodigoPais(op.pais)
      if (codigo) {
        if (!agrupado[codigo]) {
          agrupado[codigo] = { nome: op.pais, intercambios: [] }
        }
        agrupado[codigo].intercambios.push(op)
      }
    }
    return agrupado
  }, [])

  const [showMap, setShowMap] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowMap(true), 100)
    const timer2 = setTimeout(() => setShowSidebar(true), 300)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const isMobileView = window.innerWidth < 768
  const baseTransition = "transition-all duration-500 ease-in-out transform"

  return (
    <div className="flex h-screen flex-col bg-slate-950 font-inter text-white md:flex-row">
      <div
        className={`relative flex w-full items-center justify-center md:h-full md:basis-3/4 ${baseTransition} ${showMap ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"} ${clickedCountryData && isMobileView ? "z-10 h-0 opacity-0" : "z-10 flex-1 opacity-100 md:h-full"}`}
      >
        <WorldMap
          exchangeData={oportunidadesPorCodigo}
          onMarkerClick={(data) => setClickedCountryData(data as CountryData)}
        />
      </div>

      <div
        className={`relative flex w-full flex-col border border-slate-950 bg-slate-900 shadow-lg md:h-full md:basis-1/4 ${baseTransition} ${showSidebar ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"} ${clickedCountryData && isMobileView ? "z-20 h-full" : "z-20 flex-1 md:h-full"}`}
      >
        {clickedCountryData && (
          <button
            className="absolute top-4 right-4 z-30 text-white transition-colors hover:text-amber-500"
            onClick={() => setClickedCountryData(null)}
            title="Fechar detalhes do país"
            type="button"
          >
            <FaTimes size={20} />
          </button>
        )}

        <div className="px-6 py-4">
          <h2 className="mb-4 border-slate-950 border-b pb-2 font-bold text-amber-500 text-xl">
            Oportunidades de Intercâmbio
          </h2>
        </div>

        <div
          className="grow overflow-y-auto px-6 py-4 pt-0"
          id="map-sidebar-scroll"
        >
          {clickedCountryData ? (
            <div>
              <div className="mb-2 flex items-center">
                <FaMapPin className="mr-2 text-amber-500" />
                <h3 className="font-semibold text-amber-500 text-xl">
                  {clickedCountryData.nome}
                </h3>
              </div>
              <p className="mb-4 text-sm text-white">
                {clickedCountryData.intercambios.length}{" "}
                {clickedCountryData.intercambios.length === 1
                  ? "oportunidade"
                  : "oportunidades"}{" "}
                disponíveis
              </p>
              <ul className="space-y-4">
                {clickedCountryData.intercambios.map((oportunidade) => (
                  <li
                    className="rounded-md border border-slate-900 bg-slate-950 p-4 text-white shadow-md"
                    key={oportunidade.id}
                  >
                    <h4 className="mb-1 font-semibold text-lg">
                      {oportunidade.nome}
                    </h4>
                    <div className="mb-1 flex items-center text-sm text-white">
                      <FaClock className="mr-2 text-amber-500" />
                      Duração: {oportunidade.duracao}
                    </div>
                    <div className="mb-2 flex items-center text-sm text-white">
                      <FaCalendarAlt className="mr-2 text-amber-500" />
                      Prazo: {oportunidade.prazoInscricao}
                    </div>
                    <div className="mb-2 inline-block rounded-full bg-slate-900 px-3 py-1 font-semibold text-white text-xs">
                      {oportunidade.tipo}
                    </div>
                    <div className="flex justify-end">
                      <Link
                        className="flex items-center font-semibold text-amber-500"
                        to={`/oportunidades/internacionais/${oportunidade.id}`}
                      >
                        Saiba Mais <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="mb-2 font-semibold text-lg text-white">
                Como Usar o Mapa
              </h3>
              <ol className="mb-4 list-decimal pl-5 text-sm text-white">
                <li>
                  Clique em um marcador de país no mapa para ver as
                  oportunidades disponíveis.
                </li>
                <li>
                  Use a barra lateral para ver informações detalhadas sobre as
                  oportunidades.
                </li>
              </ol>
              <h3 className="mt-4 mb-2 hidden font-semibold text-lg text-white md:block">
                Países com Oportunidades
              </h3>
              <div className="hidden grid-cols-2 gap-2 text-sm md:grid">
                {listaDePaisesComOportunidades.map((pais) => (
                  <button
                    className="rounded-md border border-slate-900 bg-slate-950 p-2 text-left text-white hover:bg-slate-800"
                    key={pais.codigo}
                    onClick={() => setClickedCountryData(pais)}
                    type="button"
                  >
                    <span className="font-semibold text-amber-500">
                      {pais.nome}
                    </span>
                    <br />
                    {pais.count}{" "}
                    {pais.count === 1 ? "oportunidade" : "oportunidades"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorldMapPage
