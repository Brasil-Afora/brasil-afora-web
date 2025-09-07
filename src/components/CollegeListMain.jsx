import React, { useState, useEffect, useRef } from 'react';
import CollegeFilter from './CollegeFilter';
import CollegeList from './CollegeList';
import { universidades as universidadesOriginais } from '../utils/collegeData';
import { FaTimesCircle, FaChevronUp, FaChevronDown, FaSearch, FaSlidersH, FaTimes, FaCheck } from 'react-icons/fa';
import useSessionStorage from '../utils/useSessionStorage';

const CollegeListMain = () => {
    const initialFiltros = {
        nome: '',
        estado: [],
        taxaAceitacao: '',
        notaSAT: '',
        notaACT: '',
        testesProficiencia: [],
        politicaFinanceira: [],
        majorsPrincipais: [],
    };
    const [filtros, setFiltros] = useSessionStorage('collegeFiltros', initialFiltros);
    const [filtrosTemporarios, setFiltrosTemporarios] = useState(filtros);
    const [universidadesFiltradas, setUniversidadesFiltradas] = useState(universidadesOriginais);
    const [showTitle, setShowTitle] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const isInitialMount = useRef(true);
    const [sortCriteria, setSortCriteria] = useState('rankingNacional');
    const [sortDirection, setSortDirection] = useState('asc');

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
            let dadosFiltrados = universidadesOriginais;
            
            if (filtros.nome) {
                dadosFiltrados = dadosFiltrados.filter(uni =>
                    uni.nome.toLowerCase().includes(filtros.nome.toLowerCase().trim())
                );
            }
            if (filtros.estado.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(uni =>
                    filtros.estado.includes(uni.estado)
                );
            }
            if (filtros.taxaAceitacao) {
                const taxaInput = Number(filtros.taxaAceitacao);
                if (!isNaN(taxaInput)) {
                    dadosFiltrados = dadosFiltrados.filter(uni => {
                        const taxaUni = Number(uni.taxaAceitacao.replace('%', ''));
                        return taxaUni >= taxaInput;
                    });
                }
            }
            if (filtros.notaSAT) {
                const satInput = Number(filtros.notaSAT);
                if (!isNaN(satInput)) {
                    dadosFiltrados = dadosFiltrados.filter(uni => {
                        const satUni = uni.faixaSAT.split('-').map(Number);
                        if (satUni.length === 2) {
                            return satInput >= satUni[0] && satInput <= satUni[1];
                        }
                        return false;
                    });
                }
            }
            if (filtros.notaACT) {
                const actInput = Number(filtros.notaACT);
                if (!isNaN(actInput)) {
                    dadosFiltrados = dadosFiltrados.filter(uni => {
                        const actUni = uni.faixaACT.split('-').map(Number);
                        if (actUni.length === 2) {
                            return actInput >= actUni[0] && actInput <= actUni[1];
                        }
                        return false;
                    });
                }
            }
            if (filtros.testesProficiencia.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(uni => {
                    const testesUni = uni.testesProficiencia.split(', ');
                    return filtros.testesProficiencia.every(test => testesUni.includes(test));
                });
            }
            if (filtros.politicaFinanceira.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(uni =>
                    filtros.politicaFinanceira.includes(uni.politicaFinanceira)
                );
            }
            if (filtros.majorsPrincipais.length > 0) {
                dadosFiltrados = dadosFiltrados.filter(uni => {
                    const majorsUni = uni.majorsPrincipais.split(', ');
                    return filtros.majorsPrincipais.some(major => majorsUni.includes(major));
                });
            }

            if (sortCriteria) {
                const sortedData = [...dadosFiltrados].sort((a, b) => {
                    let valueA, valueB;
                    if (sortCriteria === 'taxaAceitacao') {
                        valueA = Number(a.taxaAceitacao.replace('%', ''));
                        valueB = Number(b.taxaAceitacao.replace('%', ''));
                    } else if (sortCriteria === 'tuition') {
                        valueA = Number(a.tuition.replace(/[^0-9]/g, ''));
                        valueB = Number(b.tuition.replace(/[^0-9]/g, ''));
                    } else if (sortCriteria === 'rankingNacional') {
                        valueA = Number(a.rankingNacional.replace('N/A', Infinity));
                        valueB = Number(b.rankingNacional.replace('N/A', Infinity));
                    }
                    if (sortDirection === 'asc') {
                        return valueA - valueB;
                    } else {
                        return valueB - valueA;
                    }
                });
                setUniversidadesFiltradas(sortedData);
            } else {
                setUniversidadesFiltradas(dadosFiltrados);
            }

            if (isInitialMount.current) {
                isInitialMount.current = false;
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
        filtrarOportunidades();
    }, [filtros, sortCriteria, sortDirection]);

    const isFilterActive = () => {
        return Object.values(filtros).some(value => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value !== '';
        });
    };

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

    const handleSort = (criteria) => {
        if (sortCriteria === criteria) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCriteria(criteria);
            setSortDirection(criteria === 'rankingNacional' ? 'asc' : 'desc');
        }
    };

    const handleToggleFilterSidebar = () => {
        setFiltrosTemporarios(filtros);
        setShowFilter(!showFilter);
    };

    const handleApplyFilters = () => {
        setFiltros(filtrosTemporarios);
        setShowFilter(false);
    };

    const handleSearchInputChange = (e) => {
        const { value } = e.target;
        setFiltros(prev => ({ ...prev, nome: value }));
    };

    const baseTransition = "transition-all duration-500 ease-in-out transform";
    const count = universidadesFiltradas.length;
    const countText = count === 1 ? '1 Universidade Encontrada' : `${count} Universidades Encontradas`;

    const getEstadoNome = (abbr) => {
        const estadosData = [
            { abbr: "MA", nome: "Massachusetts" }, { abbr: "CT", nome: "Connecticut" },
            { abbr: "CA", nome: "Califórnia" }, { abbr: "NH", nome: "New Hampshire" },
            { abbr: "RI", nome: "Rhode Island" }, { abbr: "NY", nome: "Nova York" },
            { abbr: "TX", nome: "Texas" }, { abbr: "TN", nome: "Tennessee" },
            { abbr: "PA", nome: "Pensilvânia" }, { abbr: "NC", nome: "Carolina do Norte" },
            { abbr: "IL", nome: "Illinois" }, { abbr: "MD", nome: "Maryland" },
            { abbr: "FL", nome: "Flórida" }, { abbr: "WA", nome: "Washington" },
            { abbr: "VT", nome: "Vermont" }, { abbr: "ME", nome: "Maine" },
            { abbr: "OH", nome: "Ohio" }, { abbr: "MN", nome: "Minnesota" },
            { abbr: "UT", nome: "Utah" }, { abbr: "NJ", nome: "Nova Jersey" },
            { abbr: "CO", nome: "Colorado" }, { abbr: "IN", nome: "Indiana" },
            { abbr: "ID", nome: "Idaho" }, { abbr: "MO", nome: "Missouri" }
        ];
        const estado = estadosData.find(e => e.abbr === abbr);
        return estado ? `${estado.nome}` : abbr;
    };

    const renderAppliedFilters = () => {
        const applied = [];
        if (filtros.nome) {
            applied.push({ key: 'nome', value: `Nome: ${filtros.nome}` });
        }
        if (filtros.estado && filtros.estado.length > 0) {
            filtros.estado.forEach(e => applied.push({ key: 'estado', value: getEstadoNome(e) }));
        }
        if (filtros.taxaAceitacao) {
            applied.push({ key: 'taxaAceitacao', value: `Aceitação > ${filtros.taxaAceitacao}%` });
        }
        if (filtros.notaSAT) {
            applied.push({ key: 'notaSAT', value: `SAT: ${filtros.notaSAT}` });
        }
        if (filtros.notaACT) {
            applied.push({ key: 'notaACT', value: `ACT: ${filtros.notaACT}` });
        }
        if (filtros.testesProficiencia && filtros.testesProficiencia.length > 0) {
            filtros.testesProficiencia.forEach(t => applied.push({ key: 'testesProficiencia', value: t }));
        }
        if (filtros.politicaFinanceira && filtros.politicaFinanceira.length > 0) {
            filtros.politicaFinanceira.forEach(p => applied.push({ key: 'politicaFinanceira', value: p }));
        }

        return (
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-white">
                {applied.map((filter, index) => (
                    <span key={index} className="bg-slate-900 text-white px-3 py-1 rounded-full flex items-center gap-1">
                        {filter.value}
                        <button onClick={() => handleRemoveFilter(filter.key, filter.value)} className="text-white opacity-70 hover:opacity-100 transition-opacity">
                            <FaTimesCircle className="ml-1" />
                        </button>
                    </span>
                ))}
            </div>
        );
    };

    const sortButtonClass = (criteria) =>
        `px-2 py-1 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-1 text-xs ${sortCriteria === criteria ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`;
    
    return (
        <div className="bg-slate-950 text-white min-h-screen font-inter">
            {!isFilterActive() && (
                <div className={`px-8 pt-8 pb-12 text-center ${baseTransition} ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <FaSearch className="text-4xl text-amber-500" />
                        <h1 className="text-4xl font-bold text-amber-500">Busca por Faculdades</h1>
                    </div>
                    <p className="text-center text-lg mt-4 font-light max-w-2xl mx-auto text-white">
                        Encontre a faculdade perfeita para você. Busque, compare e gerencie sua jornada de aplicação em um só lugar.
                    </p>
                </div>
            )}

            <div className={`md:hidden px-6 ${isFilterActive() ? 'mt-4 mb-4' : 'mt-0 mb-4'}`}>
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-50 text-xs" />
                        <input
                            type="text"
                            value={filtros.nome}
                            onChange={handleSearchInputChange}
                            placeholder="Pesquisar por nome..."
                            className="w-full pl-10 pr-3 p-2 rounded-lg bg-slate-900 text-white border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <button
                        onClick={handleToggleFilterSidebar}
                        className="py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition-colors"
                    >
                        <FaSlidersH />
                    </button>
                </div>
            </div>

            
            {showFilter && (
                <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-slate-900 rounded-lg p-6 w-11/12 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-amber-500">Filtros</h2>
                            <button onClick={handleToggleFilterSidebar} className="text-white hover:text-amber-500">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <CollegeFilter filtros={filtrosTemporarios} setFiltros={setFiltrosTemporarios} onClearFilters={() => setFiltrosTemporarios(initialFiltros)} />
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
                                <span className="flex items-center justify-center gap-2"><FaTimes /> Limpar Tudo</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex flex-col md:flex-row px-6 gap-6 md:mt-4 ${baseTransition} ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                
                <div className={`hidden md:block md:w-1/4 ${baseTransition} ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="p-6 bg-slate-900 rounded-lg shadow-lg sticky top-24 border border-slate-950">
                        <div className="flex items-center text-lg font-bold mb-4 text-amber-500">
                            <FaSlidersH className="text-amber-500 mr-2" />
                            Filtros
                        </div>
                        <CollegeFilter filtros={filtros} setFiltros={setFiltros} onClearFilters={handleClearAllFilters} />
                    </div>
                </div>

                <div className="md:w-3/4">
                    
                    <div className="hidden md:block w-full mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={filtros.nome}
                                onChange={handleSearchInputChange}
                                placeholder="Pesquisar por nome..."
                                className="w-full pl-10 pr-3 p-2 rounded-lg bg-slate-900 text-white border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-50 text-xs" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-4">
                        <div className="flex gap-2 text-sm md:mt-0">
                            <button
                                onClick={() => handleSort('taxaAceitacao')}
                                className={sortButtonClass('taxaAceitacao')}
                            >
                                Aceitação
                                {sortCriteria === 'taxaAceitacao' && (
                                    sortDirection === 'asc' ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('tuition')}
                                className={sortButtonClass('tuition')}
                            >
                                Anuidade
                                {sortCriteria === 'tuition' && (
                                    sortDirection === 'asc' ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={() => handleSort('rankingNacional')}
                                className={sortButtonClass('rankingNacional')}
                            >
                                Ranking
                                {sortCriteria === 'rankingNacional' && (
                                    sortDirection === 'asc' ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-lg font-semibold mt-4 md:mt-0 text-white md:text-right">{countText}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {renderAppliedFilters()}
                    </div>

                    <CollegeList data={universidadesFiltradas} onClearFilters={handleClearAllFilters} />
                </div>
            </div>
        </div>
    );
};

export default CollegeListMain;