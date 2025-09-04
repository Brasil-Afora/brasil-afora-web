import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

const OpportunitiesFilter = ({ setFiltros, filtrosIniciais, filtros }) => {
    const [openFilter, setOpenFilter] = useState(null);
    const filterRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [paisesOptions, setPaisesOptions] = useState([]);
    const [niveisEnsinoOptions, setNiveisEnsinoOptions] = useState([]);
    const [tiposProgramaOptions, setTiposProgramaOptions] = useState([]);
    const [requisitosIdiomaOptions, setRequisitosIdiomaOptions] = useState([]);
    const [taxaAplicacaoOptions, setTaxaAplicacaoOptions] = useState([]);
    const [tipoBolsaOptions, setTipoBolsaOptions] = useState([]);

    const allPaises = [
        "Alemanha", "Argentina", "Austrália", "Áustria", "Canadá", "Chile", "China", "Coreia do Sul", "Costa Rica", "Dinamarca", "Espanha", "Estados Unidos", "França", "Hong Kong", "Índia", "Irlanda", "Itália", "Japão", "México", "Noruega", "Nova Zelândia", "Países Baixos", "Portugal", "Reino Unido", "Singapura", "Suécia", "Suíça", "Tailândia", "Brasil", "Rússia", "Egito", "Turquia", "Grécia", "Malásia", "Indonésia", "Bélgica", "Vietnã", "Peru", "Emirados Árabes Unidos", "Marrocos", "Israel", "Polônia", "República Tcheca", "África do Sul", "Colômbia", "Ucrânia", "Hungria", "Romênia", "Croácia", "Islândia", "Finlândia", "Filipinas", "República Dominicana", "Tunísia", "Bulgária", "Chipre", "Geórgia", "Líbano", "Jordânia", "Qatar", "Arábia Saudita", "Kuwait", "Omã", "Lituânia", "Eslováquia", "Estonia", "Bahrein", "Malta", "Luxemburgo", "San Marino", "Andorra", "Mônaco", "Cazaquistão", "Azerbaijão", "Uganda", "Quênia", "Tanzânia", "Ruanda", "Senegal", "Nigéria", "Gana", "Gâmbia", "Namíbia", "Botswana", "Zâmbia", "Madagascar", "Moçambique", "Benin", "Togo", "Burkina Faso", "Guiné", "Somália", "Cabo Verde", "Seychelles", "Maldivas"
    ].sort();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setOpenFilter(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);

    useEffect(() => {
        const niveis = [
            "Ano Sabático", "Doutorado", "Ensino Médio", "Graduação", "Mestrado", "Pós-Doutorado", "MBA"
        ];
        const tipos = [
            "Curso curta duração", "Curso de idiomas", "Curso de verão", "Doutorado", "Estágio/Trabalho", "Evento/Workshop", "Graduação", "High School", "Intercâmbio cultural", "MBA", "Mestrado", "Mobilidade acadêmica", "Pesquisa", "Trabalho voluntário"
        ];
        const idiomas = [
            "Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Japonês", "Mandarim", "Cantonês", "Holandês", "Português"
        ];
        const taxas = ["Gratuito", "Pago"];
        const bolsas = ["Completa", "Parcial", "Sem bolsa"];
        
        setPaisesOptions(allPaises);
        setNiveisEnsinoOptions(niveis.sort());
        setTiposProgramaOptions(tipos.sort());
        setRequisitosIdiomaOptions(idiomas.sort());
        setTaxaAplicacaoOptions(taxas.sort());
        setTipoBolsaOptions(bolsas.sort());
    }, []);

    const handleCheckboxChange = (id, value) => {
        const currentArray = filtros[id] || [];
        if (currentArray.includes(value)) {
            setFiltros(prev => ({ ...prev, [id]: currentArray.filter(item => item !== value) }));
        } else {
            setFiltros(prev => ({ ...prev, [id]: [...currentArray, value] }));
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFiltros(prev => ({ ...prev, [id]: value }));
    };

    const handleClearFilters = () => {
        setFiltros(filtrosIniciais);
    };

    const isFilterActive = () => {
        return (
            filtros.idade !== '' ||
            (filtros.pais && filtros.pais.length > 0) ||
            (filtros.nivelEnsino && filtros.nivelEnsino.length > 0) ||
            (filtros.tipo && filtros.tipo.length > 0) ||
            (filtros.requisitosIdioma && filtros.requisitosIdioma.length > 0) ||
            (filtros.taxaAplicacao && filtros.taxaAplicacao.length > 0) ||
            (filtros.tipoBolsa && filtros.tipoBolsa.length > 0)
        );
    };

    const toggleFilter = (filterName) => {
        setOpenFilter(openFilter === filterName ? null : filterName);
        setSearchTerm('');
    };

    const inputClasses = "p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 w-full text-sm";
    const dropdownButtonClasses = "p-2 rounded bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 w-full flex justify-between items-center cursor-pointer text-sm";
    const dropdownMenuClasses = "absolute mt-2 left-0 z-20 w-full max-h-60 overflow-y-auto bg-slate-900 rounded-lg shadow-xl p-3 border border-slate-950 text-white";
    const commonWidth = "w-full";
    const checkboxClasses = "rounded text-amber-500 bg-slate-950 border-slate-900 focus:ring-amber-500";

    const getPlaceholder = (filterType, options, customLabel) => {
        const count = filtros[filterType] ? filtros[filterType].length : 0;
        if (count === 0) return customLabel;
        if (count === 1) return filtros[filterType][0];
        return `${count} selecionados`;
    };

    const filteredPaises = paisesOptions.filter(pais =>
        pais.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={filterRef} className="flex flex-col gap-2 font-inter">
            {/* Tipo de Programa */}
            <div className={`relative ${commonWidth}`}>
                <label className="text-white mb-1 block text-xs">
                    <span className="text-amber-500">Tipo de Programa</span>
                </label>
                <button
                    onClick={() => toggleFilter('tipo')}
                    className={dropdownButtonClasses}
                >
                    <span>{getPlaceholder('tipo', tiposProgramaOptions, 'Qualquer programa')}</span>
                    {openFilter === 'tipo' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {openFilter === 'tipo' && (
                    <div className={dropdownMenuClasses}>
                        <div className="grid grid-cols-2 gap-2">
                            {tiposProgramaOptions.map((t, i) => (
                                <label key={i} className="flex items-center space-x-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filtros.tipo.includes(t)}
                                        onChange={() => handleCheckboxChange('tipo', t)}
                                        className={checkboxClasses}
                                    />
                                    <span>{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Nível de Ensino */}
            <div className={`relative ${commonWidth}`}>
                <label className="text-white mb-1 block text-xs">
                    <span className="text-amber-500">Nível de Ensino</span>
                </label>
                <button
                    onClick={() => toggleFilter('nivelEnsino')}
                    className={dropdownButtonClasses}
                >
                    <span>{getPlaceholder('nivelEnsino', niveisEnsinoOptions, 'Qualquer nível')}</span>
                    {openFilter === 'nivelEnsino' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {openFilter === 'nivelEnsino' && (
                    <div className={dropdownMenuClasses}>
                        <div className="flex flex-col gap-2">
                            {niveisEnsinoOptions.map((n, i) => (
                                <label key={i} className="flex items-center space-x-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filtros.nivelEnsino.includes(n)}
                                        onChange={() => handleCheckboxChange('nivelEnsino', n)}
                                        className={checkboxClasses}
                                    />
                                    <span>{n}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Países de Destino */}
            <div className={`relative ${commonWidth}`}>
                <label className="text-white mb-1 block text-xs">
                    <span className="text-amber-500">Países de Destino</span>
                </label>
                <button
                    onClick={() => toggleFilter('pais')}
                    className={dropdownButtonClasses}
                >
                    <span>{getPlaceholder('pais', paisesOptions, 'Todos os países')}</span>
                    {openFilter === 'pais' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {openFilter === 'pais' && (
                    <div className={dropdownMenuClasses}>
                        <div className="p-2 mb-2 bg-slate-950 rounded-md sticky top-0">
                            <div className="relative flex items-center">
                                <FaSearch className="absolute left-3 text-white text-opacity-50 text-xs" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Pesquisar país..."
                                    className="pl-10 p-2 w-full bg-slate-900 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {filteredPaises.map((p, i) => (
                                <label key={i} className="flex items-center space-x-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filtros.pais.includes(p)}
                                        onChange={() => handleCheckboxChange('pais', p)}
                                        className={checkboxClasses}
                                    />
                                    <span>{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Idiomas */}
            <div className={`relative ${commonWidth}`}>
                <label className="text-white mb-1 block text-xs">
                    <span className="text-amber-500">Idiomas</span>
                </label>
                <button
                    onClick={() => toggleFilter('requisitosIdioma')}
                    className={dropdownButtonClasses}
                >
                    <span>{getPlaceholder('requisitosIdioma', requisitosIdiomaOptions, 'Qualquer idioma')}</span>
                    {openFilter === 'requisitosIdioma' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {openFilter === 'requisitosIdioma' && (
                    <div className={dropdownMenuClasses}>
                        <div className="grid grid-cols-2 gap-2">
                            {requisitosIdiomaOptions.map((i, idx) => (
                                <label key={idx} className="flex items-center space-x-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filtros.requisitosIdioma.includes(i)}
                                        onChange={() => handleCheckboxChange('requisitosIdioma', i)}
                                        className={checkboxClasses}
                                    />
                                    <span>{i}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Taxa de Aplicação */}
            <div className={`relative ${commonWidth}`}>
                <label className="text-white mb-1 block text-xs">
                    <span className="text-amber-500">Taxa de Aplicação</span>
                </label>
                <button
                    onClick={() => toggleFilter('taxaAplicacao')}
                    className={dropdownButtonClasses}
                >
                    <span>{getPlaceholder('taxaAplicacao', taxaAplicacaoOptions, 'Qualquer taxa')}</span>
                    {openFilter === 'taxaAplicacao' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {openFilter === 'taxaAplicacao' && (
                    <div className={dropdownMenuClasses}>
                        <div className="flex flex-col gap-2">
                            {taxaAplicacaoOptions.map((t, idx) => (
                                <label key={idx} className="flex items-center space-x-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filtros.taxaAplicacao.includes(t)}
                                        onChange={() => handleCheckboxChange('taxaAplicacao', t)}
                                        className={checkboxClasses}
                                    />
                                    <span>{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Tipo de Bolsa */}
            <div className={`relative ${commonWidth}`}>
                <label className="text-white mb-1 block text-xs">
                    <span className="text-amber-500">Tipo de Bolsa</span>
                </label>
                <button
                    onClick={() => toggleFilter('tipoBolsa')}
                    className={dropdownButtonClasses}
                >
                    <span>{getPlaceholder('tipoBolsa', tipoBolsaOptions, 'Qualquer bolsa')}</span>
                    {openFilter === 'tipoBolsa' ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {openFilter === 'tipoBolsa' && (
                    <div className={dropdownMenuClasses}>
                        <div className="flex flex-col gap-2">
                            {tipoBolsaOptions.map((t, idx) => (
                                <label key={idx} className="flex items-center space-x-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filtros.tipoBolsa.includes(t)}
                                        onChange={() => handleCheckboxChange('tipoBolsa', t)}
                                        className={checkboxClasses}
                                    />
                                    <span>{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Idade */}
            <div className={commonWidth}>
                <label className="text-white mb-1 block text-xs" htmlFor="idade">
                    <span className="text-amber-500">Sua idade</span>
                </label>
                <input
                    id="idade"
                    type="number"
                    value={filtros.idade}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Ex: 18"
                />
            </div>
            <div className="mt-2">
                <button
                    onClick={handleClearFilters}
                    disabled={!isFilterActive()}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors duration-200 text-sm
                        ${isFilterActive() ? 'bg-amber-500 hover:bg-amber-600 text-black' : 'bg-slate-900 text-slate-500 cursor-not-allowed'}`}
                >
                    Limpar Filtros
                </button>
            </div>
        </div>
    );
};

export default OpportunitiesFilter;