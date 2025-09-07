import React, { useState, useEffect, useRef } from 'react';
import OpportunitiesFilter from './OpportunitiesFilter';
import OpportunitiesList from './OpportunitiesList';
import { oportunidades as oportunidadesOriginais } from '../utils/opportunitiesData';
import useSessionStorage from '../utils/useSessionStorage';
import { FaFilter, FaGraduationCap, FaTimesCircle, FaSlidersH, FaTimes, FaCheck } from 'react-icons/fa';
import logo from "../assets/logo.png";

const OpportunitiesMain = () => {
    const initialFiltros = {
        idade: '',
        pais: [],
        nivelEnsino: [],
        tipo: [],
        requisitosIdioma: [],
        taxaAplicacao: [],
        tipoBolsa: [],
    };

    const [filtros, setFiltros] = useSessionStorage('oportunidadesFiltros', initialFiltros);
    const [filtrosTemporarios, setFiltrosTemporarios] = useState(filtros);
    const [oportunidadesFiltradas, setOportunidadesFiltradas] = useState(oportunidadesOriginais);
    const [showTitle, setShowTitle] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const isInitialMount = useRef(true);
    const [showFilter, setShowFilter] = useState(false);

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

    useEffect(() => {
        const timer1 = setTimeout(() => setShowTitle(true), 100);
        const timer2 = setTimeout(() => setShowContent(true), 300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    useEffect(() => {
        const filtrarOportunidades = () => {
            let dadosFiltrados = oportunidadesOriginais;

            if (filtros.idade) {
                const idadeInput = Number(filtros.idade);
                if (!isNaN(idadeInput)) {
                    dadosFiltrados = dadosFiltrados.filter(op => {
                        const faixaEtaria = op.faixaEtaria;
                        if (faixaEtaria) {
                            const numeros = faixaEtaria.match(/\d+/g)?.map(Number);
                            if (numeros && numeros.length === 2) {
                                const [min, max] = numeros;
                                return idadeInput >= min && idadeInput <= max;
                            } else if (numeros && numeros.length === 1 && faixaEtaria.includes('+')) {
                                const [min] = numeros;
                                return idadeInput >= min;
                            } else if (numeros && numeros.length === 1) {
                                const [idadeExata] = numeros;
                                return idadeInput === idadeExata;
                            }
                        }
                        return false;
                    });
                }
            }

            if (filtros.pais && filtros.pais.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(op =>
                    op.pais && filtros.pais.includes(op.pais)
                );
            }

            if (filtros.nivelEnsino && filtros.nivelEnsino.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(op =>
                    op.nivelEnsino && filtros.nivelEnsino.includes(op.nivelEnsino)
                );
            }

            if (filtros.tipo && filtros.tipo.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(op =>
                    op.tipo && filtros.tipo.includes(op.tipo)
                );
            }

            if (filtros.requisitosIdioma && filtros.requisitosIdioma.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(op =>
                    op.requisitosIdioma && filtros.requisitosIdioma.some(idioma => op.requisitosIdioma.includes(idioma))
                );
            }

            if (filtros.taxaAplicacao && filtros.taxaAplicacao.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(op =>
                    op.taxaAplicacao && filtros.taxaAplicacao.includes(op.taxaAplicacao)
                );
            }

            if (filtros.tipoBolsa && filtros.tipoBolsa.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(op =>
                    op.tipoBolsa && filtros.tipoBolsa.includes(op.tipoBolsa)
                );
            }

            setOportunidadesFiltradas(dadosFiltrados);
        };

        filtrarOportunidades();
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [filtros]);

    const handleRemoveFilter = (key, valueToRemove) => {
        setFiltros(prev => {
            if (Array.isArray(prev[key])) {
                return { ...prev, [key]: prev[key].filter(val => val !== valueToRemove) };
            } else {
                return { ...prev, [key]: initialFiltros[key] };
            }
        });
    };

    const handleClearAllFilters = () => {
        setFiltros(initialFiltros);
        setFiltrosTemporarios(initialFiltros);
        setShowFilter(false);
    };

    const handleToggleFilterSidebar = () => {
        setFiltrosTemporarios(filtros);
        setShowFilter(!showFilter);
    };

    const handleApplyFilters = () => {
        setFiltros(filtrosTemporarios);
        setShowFilter(false);
    };

    const baseTransition = "transition-all duration-500 ease-in-out transform";

    const renderAppliedFilters = () => {
        const applied = [];
        if (filtros.idade) {
            applied.push({ key: 'idade', value: `Idade: ${filtros.idade}` });
        }
        if (filtros.pais && filtros.pais.length > 0) {
            filtros.pais.forEach(p => applied.push({ key: 'pais', value: p }));
        }
        if (filtros.nivelEnsino && filtros.nivelEnsino.length > 0) {
            filtros.nivelEnsino.forEach(n => applied.push({ key: 'nivelEnsino', value: n }));
        }
        if (filtros.tipo && filtros.tipo.length > 0) {
            filtros.tipo.forEach(t => applied.push({ key: 'tipo', value: t }));
        }
        if (filtros.requisitosIdioma && filtros.requisitosIdioma.length > 0) {
            filtros.requisitosIdioma.forEach(i => applied.push({ key: 'requisitosIdioma', value: i }));
        }
        if (filtros.taxaAplicacao && filtros.taxaAplicacao.length > 0) {
            filtros.taxaAplicacao.forEach(t => applied.push({ key: 'taxaAplicacao', value: t }));
        }
        if (filtros.tipoBolsa && filtros.tipoBolsa.length > 0) {
            filtros.tipoBolsa.forEach(t => applied.push({ key: 'tipoBolsa', value: t }));
        }

        return (
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-white">
                {applied.map((filter, index) => (
                    <span key={index} className="bg-slate-900 text-white px-3 py-1 rounded-full flex items-center gap-1">
                        {filter.key === 'idade' ? filter.value : `${filter.key.charAt(0).toUpperCase() + filter.key.slice(1)}: ${filter.value}`}
                        <button onClick={() => handleRemoveFilter(filter.key, filter.value)} className="text-white opacity-70 hover:opacity-100 transition-opacity">
                            <FaTimesCircle className="ml-1" />
                        </button>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-slate-950 text-white min-h-screen font-inter">
            
            {!isFilterActive() && (
                <div className={`px-8 pt-8 pb-12 text-center ${baseTransition} ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <FaGraduationCap className="text-5xl text-amber-500" />
                        <h1 className="text-4xl font-bold text-amber-500">
                            Oportunidades Disponíveis
                        </h1>
                    </div>
                    <p className="text-center text-lg mt-4 font-light max-w-2xl mx-auto text-white">
                        Descubra experiências que mudam vidas em todo o mundo. De programas de estudo no exterior a oportunidades de voluntariado, sua próxima aventura o aguarda.
                    </p>
                </div>
            )}
            
            
            {showFilter && (
                <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-slate-900 rounded-lg p-6 w-11/12 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-amber-500">Filtros</h2>
                            <button onClick={handleToggleFilterSidebar} className="text-white hover:text-amber-500">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <OpportunitiesFilter setFiltros={setFiltrosTemporarios} filtros={filtrosTemporarios} filtrosIniciais={initialFiltros}/>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleApplyFilters}
                                className="w-full py-2 rounded-lg font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-colors"
                            >
                                <span className="flex items-center justify-center gap-2"><FaCheck /> Aplicar Filtros</span>
                            </button>
                            <button
                                onClick={handleClearAllFilters}
                                className="w-full py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                                <span className="flex items-center justify-center gap-2"><FaTimes /> Limpar Filtros</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row px-6 gap-6">
                
                <div className={`hidden md:block md:w-1/4 ${baseTransition} ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="p-6 bg-slate-900 rounded-lg shadow-lg sticky top-24 border border-slate-950">
                        <div className="flex items-center text-lg font-bold mb-4 text-amber-500">
                            <FaFilter className="text-amber-500 mr-2" />
                            Filtros
                        </div>
                        <OpportunitiesFilter setFiltros={setFiltros} filtros={filtros} filtrosIniciais={initialFiltros} />
                    </div>
                </div>

                <div className={`md:w-3/4 ${baseTransition} ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <p className="text-lg font-semibold text-white">{`Exibindo ${oportunidadesFiltradas.length} oportunidades`}</p>
                        
                        <div className="md:hidden w-full mt-4">
                            <button
                                onClick={handleToggleFilterSidebar}
                                className="w-full py-2 rounded-lg font-semibold text-black bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaSlidersH /> Abrir Filtros
                            </button>
                        </div>
                        {renderAppliedFilters()}
                    </div>
                    {oportunidadesFiltradas.length > 0 ? (
                        <OpportunitiesList data={oportunidadesFiltradas} />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-slate-950 rounded-lg shadow-lg border border-slate-950">
                            <img src={logo} alt="Logo Global Passport" className="h-16 mb-4 opacity-80" />
                            <h3 className="text-2xl font-bold mb-2 text-white">Nenhuma oportunidade encontrada</h3>
                            <p className="text-sm text-white mb-6">Tente ajustar seus filtros para ver mais resultados.</p>
                            <button
                                onClick={handleClearAllFilters}
                                className="bg-amber-500 text-black font-bold py-2 px-6 rounded-full hover:bg-amber-600 transition-colors duration-300"
                            >
                                Limpar Todos os Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpportunitiesMain;