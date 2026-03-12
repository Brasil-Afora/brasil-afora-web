import { Book, Search } from "lucide-react"
import { useEffect, useState } from "react"

export const dictionaryTerms = [
  {
    term: "Ano Sabático",
    definition:
      "Um período de tempo tirado por um estudante para viajar, trabalhar ou fazer voluntariado antes de começar ou continuar a faculdade.",
  },
  {
    term: "Bolsa de Estudo (Scholarship)",
    definition:
      "Ajuda financeira concedida a estudantes para cobrir custos de educação, como mensalidades, moradia e livros.",
  },
  {
    term: "Intercâmbio Cultural",
    definition:
      "Um programa que permite que indivíduos visitem outro país para aprender sobre sua cultura, idioma e tradições.",
  },
  {
    term: "GPA (Grade Point Average)",
    definition:
      "Média de notas de um estudante, usada em muitos países como critério de admissão em universidades.",
  },
  {
    term: "TOEFL (Test of English as a Foreign Language)",
    definition:
      "Teste padronizado de proficiência em inglês, amplamente exigido por universidades nos Estados Unidos e em outros países.",
  },
  {
    term: "IELTS (International English Language Testing System)",
    definition:
      "Outro teste de proficiência em inglês, popular entre universidades do Reino Unido, Austrália e outros.",
  },
  {
    term: "Visto de Estudante",
    definition:
      "Um documento oficial que permite a um estudante estrangeiro entrar e permanecer em um país para fins de estudo.",
  },
  {
    term: "Mobilidade Acadêmica",
    definition:
      "Oportunidade para estudantes universitários estudarem em uma instituição parceira no exterior por um período limitado, geralmente um semestre ou um ano.",
  },
]

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showHeader, setShowHeader] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const filteredTerms = dictionaryTerms.filter((item) =>
    item.term.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const timer1 = setTimeout(() => setShowHeader(true), 100)
    const timer2 = setTimeout(() => setShowSearch(true), 300)
    const timer3 = setTimeout(() => setShowTerms(true), 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const baseTransition = "transition-all duration-500 ease-in-out transform"

  return (
    <div className="min-h-screen bg-slate-950 font-inter text-white">
      <div
        className={`mb-8 rounded-b-2xl bg-slate-950 p-8 pt-16 text-center md:p-16 ${baseTransition} ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
      >
        <Book className="mx-auto mb-4 text-amber-500" size={64} />
        <h1 className="mb-4 font-extrabold text-4xl text-amber-500 md:text-5xl">
          Dicionário Intercambista
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white md:text-xl">
          Seu guia completo para terminologia de estudo no exterior e
          intercâmbio. Entendendo a linguagem da educação internacional.
        </p>
      </div>

      <div
        className={`sticky top-0 z-45 bg-slate-950 py-4 shadow-lg ${baseTransition} ${showSearch ? "opacity-100" : "opacity-0"}`}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center px-8">
          <div className="relative w-full">
            <input
              className="w-full rounded-lg border-none bg-slate-900 p-4 pl-12 text-white placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar termos e definições..."
              type="text"
              value={searchQuery}
            />
            <Search
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white"
              size={20}
            />
          </div>
        </div>
      </div>

      <div className="p-8 pt-6">
        <p
          className={`mb-6 text-center text-white ${baseTransition} ${showTerms ? "opacity-100" : "opacity-0"}`}
        >
          {filteredTerms.length} termos encontrados
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item, index) => (
              <div
                className={`rounded-lg border border-slate-950 bg-slate-900 p-6 shadow-lg ${baseTransition} ${showTerms ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                key={item.term}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <h2 className="mb-2 flex min-h-16 items-center font-bold text-2xl text-amber-500">
                  {item.term}
                </h2>
                <p className="text-sm text-white leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-white">
              Nenhum termo encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dictionary
