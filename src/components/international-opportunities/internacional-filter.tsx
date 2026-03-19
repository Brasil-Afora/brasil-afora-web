import type { Dispatch, SetStateAction } from "react"
import { useEffect, useRef, useState } from "react"
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa"
import type { OpportunitiesFiltros } from "./types"

interface InternacionalFilterProps {
  filtros: OpportunitiesFiltros
  filtrosIniciais: OpportunitiesFiltros
  setFiltros: Dispatch<SetStateAction<OpportunitiesFiltros>>
}

const allPaises = [
  "Adamar",
  "Alemanha",
  "Andorra",
  "Arábia Saudita",
  "Argentina",
  "Austrália",
  "Áustria",
  "Azerbaijão",
  "Bahrein",
  "Bélgica",
  "Benin",
  "Botswana",
  "Brasil",
  "Bulgária",
  "Burkina Faso",
  "Cabo Verde",
  "Canadá",
  "Cazaquistão",
  "Chile",
  "China",
  "Chipre",
  "Colômbia",
  "Coreia do Sul",
  "Costa Rica",
  "Croácia",
  "Dinamarca",
  "Egito",
  "Emirados Árabes Unidos",
  "Eslováquia",
  "Espanha",
  "Estados Unidos",
  "Estonia",
  "Filipinas",
  "Finlândia",
  "França",
  "Gâmbia",
  "Gana",
  "Geórgia",
  "Grécia",
  "Guiné",
  "Hong Kong",
  "Hungria",
  "Índia",
  "Indonésia",
  "Irlanda",
  "Islândia",
  "Israel",
  "Itália",
  "Japão",
  "Jordânia",
  "Kuwait",
  "Líbano",
  "Lituânia",
  "Luxemburgo",
  "Madagascar",
  "Malásia",
  "Malta",
  "Marrocos",
  "México",
  "Mônaco",
  "Moçambique",
  "Namíbia",
  "Nigéria",
  "Noruega",
  "Nova Zelândia",
  "Omã",
  "Países Baixos",
  "Peru",
  "Polônia",
  "Portugal",
  "Qatar",
  "Reino Unido",
  "República Dominicana",
  "República Tcheca",
  "Romênia",
  "Ruanda",
  "Rússia",
  "San Marino",
  "Senegal",
  "Seychelles",
  "Singapura",
  "Somália",
  "Suécia",
  "Suíça",
  "Tailândia",
  "Tanzânia",
  "Togo",
  "Tunísia",
  "Turquia",
  "Ucrânia",
  "Uganda",
  "Vietnã",
  "Zâmbia",
].sort()

const niveisEnsinoOptions = [
  "Ano Sabático",
  "Doutorado",
  "Ensino Médio",
  "Graduação",
  "MBA",
  "Mestrado",
  "Pós-Doutorado",
].sort()

const tiposProgramaOptions = [
  "Curso curta duração",
  "Curso de idiomas",
  "Curso de verão",
  "Doutorado",
  "Estágio/Trabalho",
  "Evento/Workshop",
  "Graduação",
  "High School",
  "Intercâmbio cultural",
  "MBA",
  "Mestrado",
  "Mobilidade acadêmica",
  "Pesquisa",
  "Trabalho voluntário",
].sort()

const requisitosIdiomaOptions = [
  "Alemão",
  "Cantonês",
  "Espanhol",
  "Francês",
  "Holandês",
  "Inglês",
  "Italiano",
  "Japonês",
  "Mandarim",
  "Português",
].sort()

const taxaAplicacaoOptions = ["Gratuito", "Pago"].sort()
const tipoBolsaOptions = ["Completa", "Parcial", "Sem bolsa"].sort()

const InternacionalFilter = ({
  filtros,
  setFiltros,
  filtrosIniciais,
}: InternacionalFilterProps) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCheckboxChange = (
    id: keyof OpportunitiesFiltros,
    value: string
  ) => {
    const currentArray = (filtros[id] as string[]) || []
    if (currentArray.includes(value)) {
      setFiltros((prev) => ({
        ...prev,
        [id]: currentArray.filter((item) => item !== value),
      }))
    } else {
      setFiltros((prev) => ({ ...prev, [id]: [...currentArray, value] }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFiltros((prev) => ({ ...prev, [id]: value }))
  }

  const isFilterActive = () =>
    filtros.idade !== "" ||
    filtros.pais.length > 0 ||
    filtros.nivelEnsino.length > 0 ||
    filtros.tipo.length > 0 ||
    filtros.requisitosIdioma.length > 0 ||
    filtros.taxaAplicacao.length > 0 ||
    filtros.tipoBolsa.length > 0

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName)
    setSearchTerm("")
  }

  const getPlaceholder = (
    filterKey: keyof OpportunitiesFiltros,
    defaultLabel: string
  ): string => {
    const arr = filtros[filterKey] as string[]
    if (!arr || arr.length === 0) {
      return defaultLabel
    }
    if (arr.length === 1) {
      return arr[0]
    }
    return `${arr.length} selecionados`
  }

  const filteredPaises = allPaises.filter((p) =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const inputClasses =
    "p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 h-10 w-full text-sm"
  const dropdownButtonClasses =
    "p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 h-10 w-full flex justify-between items-center cursor-pointer text-sm"
  const dropdownMenuClasses =
    "absolute mt-2 left-0 z-20 w-full max-h-60 overflow-y-auto bg-slate-900 rounded-lg shadow-xl p-3 border border-slate-950 text-white"
  const checkboxClasses =
    "rounded text-blue-500 bg-slate-950 border-slate-900 focus:ring-blue-500"

  const renderDropdown = (
    key: keyof OpportunitiesFiltros,
    label: string,
    placeholder: string,
    options: string[],
    cols: 1 | 2 = 1
  ) => (
    <div className="relative w-full">
      <p className="mb-1 block text-white text-xs">
        <span className="text-blue-400">{label}</span>
      </p>
      <button
        className={dropdownButtonClasses}
        onClick={() => toggleFilter(key)}
        type="button"
      >
        <span>{getPlaceholder(key, placeholder)}</span>
        {openFilter === key ? (
          <FaChevronUp className="ml-2" />
        ) : (
          <FaChevronDown className="ml-2" />
        )}
      </button>
      {openFilter === key && (
        <div className={dropdownMenuClasses}>
          <div
            className={`grid gap-2 ${cols === 2 ? "grid-cols-2" : "flex flex-col"}`}
          >
            {options.map((opt) => (
              <label
                className="flex cursor-pointer items-center space-x-2 text-sm"
                key={opt}
              >
                <input
                  checked={(filtros[key] as string[]).includes(opt)}
                  className={checkboxClasses}
                  onChange={() => handleCheckboxChange(key, opt)}
                  type="checkbox"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-2 font-inter" ref={filterRef}>
      {renderDropdown(
        "tipo",
        "Tipo de Programa",
        "Qualquer programa",
        tiposProgramaOptions,
        2
      )}
      {renderDropdown(
        "nivelEnsino",
        "Nível de Ensino",
        "Qualquer nível",
        niveisEnsinoOptions
      )}

      <div className="relative w-full">
        <p className="mb-1 block text-white text-xs">
          <span className="text-blue-400">Países de Destino</span>
        </p>
        <button
          className={dropdownButtonClasses}
          onClick={() => toggleFilter("pais")}
          type="button"
        >
          <span>{getPlaceholder("pais", "Todos os países")}</span>
          {openFilter === "pais" ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </button>
        {openFilter === "pais" && (
          <div className={dropdownMenuClasses}>
            <div className="sticky top-0 mb-2 rounded-md bg-slate-950 p-2">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-white text-xs text-opacity-50" />
                <input
                  className="w-full rounded bg-slate-900 p-2 pl-10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar país..."
                  type="text"
                  value={searchTerm}
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {filteredPaises.map((p) => (
                <label
                  className="flex cursor-pointer items-center space-x-2 text-sm"
                  key={p}
                >
                  <input
                    checked={filtros.pais.includes(p)}
                    className={checkboxClasses}
                    onChange={() => handleCheckboxChange("pais", p)}
                    type="checkbox"
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {renderDropdown(
        "requisitosIdioma",
        "Idiomas",
        "Qualquer idioma",
        requisitosIdiomaOptions,
        2
      )}
      {renderDropdown(
        "taxaAplicacao",
        "Taxa de Aplicação",
        "Qualquer taxa",
        taxaAplicacaoOptions
      )}
      {renderDropdown(
        "tipoBolsa",
        "Tipo de Bolsa",
        "Qualquer bolsa",
        tipoBolsaOptions
      )}

      <div className="w-full">
        <label className="mb-1 block text-white text-xs" htmlFor="idade">
          <span className="text-blue-400">Sua idade</span>
        </label>
        <input
          className={inputClasses}
          id="idade"
          onChange={handleInputChange}
          placeholder="Ex: 18"
          type="number"
          value={filtros.idade}
        />
      </div>

      <div className="mt-2 hidden md:block">
        <button
          className={`w-full rounded-lg py-2 font-semibold text-sm transition-colors duration-200 ${isFilterActive() ? "bg-blue-500 text-white hover:bg-blue-600" : "cursor-not-allowed bg-slate-900 text-slate-500"}`}
          disabled={!isFilterActive()}
          onClick={() => setFiltros(filtrosIniciais)}
          type="button"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}

export default InternacionalFilter
