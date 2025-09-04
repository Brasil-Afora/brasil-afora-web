import React, { useState, useEffect } from 'react';
import { Search, Book } from 'lucide-react';

export const dictionaryTerms = [
    { term: "Ano Sabático", definition: "Um período de tempo tirado por um estudante para viajar, trabalhar ou fazer voluntariado antes de começar ou continuar a faculdade." },
    { term: "Bolsa de Estudo (Scholarship)", definition: "Ajuda financeira concedida a estudantes para cobrir custos de educação, como mensalidades, moradia e livros." },
    { term: "Intercâmbio Cultural", definition: "Um programa que permite que indivíduos visitem outro país para aprender sobre sua cultura, idioma e tradições." },
    { term: "GPA (Grade Point Average)", definition: "Média de notas de um estudante, usada em muitos países como critério de admissão em universidades." },
    { term: "TOEFL (Test of English as a Foreign Language)", definition: "Teste padronizado de proficiência em inglês, amplamente exigido por universidades nos Estados Unidos e em outros países." },
    { term: "IELTS (International English Language Testing System)", definition: "Outro teste de proficiência em inglês, popular entre universidades do Reino Unido, Austrália e outros." },
    { term: "Visto de Estudante", definition: "Um documento oficial que permite a um estudante estrangeiro entrar e permanecer em um país para fins de estudo." },
    { term: "Mobilidade Acadêmica", definition: "Oportunidade para estudantes universitários estudarem em uma instituição parceira no exterior por um período limitado, geralmente um semestre ou um ano." },
];

const Dictionary = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const [showHeader, setShowHeader] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const filteredTerms = dictionaryTerms.filter(item =>
        item.term.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const timer1 = setTimeout(() => setShowHeader(true), 100);
        const timer2 = setTimeout(() => setShowSearch(true), 300);
        const timer3 = setTimeout(() => setShowTerms(true), 500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    const baseTransition = "transition-all duration-500 ease-in-out transform";

    return (
        <div className="bg-slate-950 min-h-screen text-white font-inter">
            <div className={`bg-slate-950 p-8 pt-16 md:p-16 text-center rounded-b-2xl mb-8 
                           ${baseTransition} ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                <Book className="mx-auto mb-4 text-amber-500" size={64} /> 
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-amber-500">
                    Dicionário Intercambista
                </h1>
                <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
                    Seu guia completo para terminologia de estudo no exterior e intercâmbio. Entendendo a linguagem da educação internacional.
                </p>
            </div>

            <div className={`sticky top-0 z-50 bg-slate-950 py-4 shadow-lg 
                            ${baseTransition} ${showSearch ? 'opacity-100' : 'opacity-0'}`}>
                <div className="max-w-2xl mx-auto px-8 flex flex-col items-center">
                    <div className="relative w-full"> 
                        <input
                            type="text"
                            placeholder="Buscar termos e definições..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-4 pl-12 rounded-lg bg-slate-900 text-white border-none placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={20} />
                    </div>
                </div>
            </div>

            <div className="p-8 pt-6">
                <p className={`text-center text-white mb-6 ${baseTransition} ${showTerms ? 'opacity-100' : 'opacity-0'}`}>
                    {filteredTerms.length} termos encontrados
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {filteredTerms.length > 0 ? (
                        filteredTerms.map((item, index) => (
                            <div 
                                key={index} 
                                className={`bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-950
                                            ${baseTransition} ${showTerms ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <h2 className="text-2xl font-bold mb-2 min-h-[4rem] flex items-center text-amber-500">{item.term}</h2>
                                <p className="text-sm text-white leading-relaxed">{item.definition}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white col-span-full">Nenhum termo encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dictionary;