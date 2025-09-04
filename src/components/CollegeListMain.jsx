import React, { useState, useEffect } from 'react';
import CollegeFilter from './CollegeFilter';
import CollegeList from './CollegeList';
import { universidades as universidadesOriginais } from '../utils/collegeData';
import { FaTimesCircle, FaChevronUp, FaChevronDown, FaSearch } from 'react-icons/fa';

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
    const [filtros, setFiltros] = useState(initialFiltros);
    const [universidadesFiltradas, setUniversidadesFiltradas] = useState(universidadesOriginais);
    const [showFilter, setShowFilter] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('rankingNacional');
    const [sortDirection, setSortDirection] = useState('asc');
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowFilter(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let dadosFiltrados = universidadesOriginais;
        let filtersAreActive = false;

        if (filtros.nome) {
            dadosFiltrados = dadosFiltrados.filter(uni =>
                uni.nome.toLowerCase().includes(filtros.nome.toLowerCase().trim())
            );
            filtersAreActive = true;
        }
        if (filtros.estado.length > 0) {
            dadosFiltrados = dadosFiltrados.filter(uni =>
                filtros.estado.includes(uni.estado)
            );
            filtersAreActive = true;
        }
        // MODIFIED: Filter logic for minimum acceptance rate
        if (filtros.taxaAceitacao) {
            const taxaInput = Number(filtros.taxaAceitacao);
            if (!isNaN(taxaInput)) {
                dadosFiltrados = dadosFiltrados.filter(uni => {
                    const taxaUni = Number(uni.taxaAceitacao.replace('%', ''));
                    return taxaUni >= taxaInput;
                });
                filtersAreActive = true;
            }
        }
        // MODIFIED: Filter logic for single SAT score
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
                filtersAreActive = true;
            }
        }
        // MODIFIED: Filter logic for single ACT score
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
                filtersAreActive = true;
            }
        }
        if (filtros.testesProficiencia.length > 0) {
            dadosFiltrados = dadosFiltrados.filter(uni => {
                const testesUni = uni.testesProficiencia.split(', ');
                return filtros.testesProficiencia.every(test => testesUni.includes(test));
            });
            filtersAreActive = true;
        }
        if (filtros.politicaFinanceira.length > 0) {
            dadosFiltrados = dadosFiltrados.filter(uni =>
                filtros.politicaFinanceira.includes(uni.politicaFinanceira)
            );
            filtersAreActive = true;
        }
        if (filtros.majorsPrincipais.length > 0) {
            dadosFiltrados = dadosFiltrados.filter(uni => {
                const majorsUni = uni.majorsPrincipais.split(', ');
                return filtros.majorsPrincipais.some(major => majorsUni.includes(major));
            });
            filtersAreActive = true;
        }

        setHasActiveFilters(filtersAreActive);

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

    }, [filtros, sortCriteria, sortDirection]);

    const handleClearFilters = () => {
        setFiltros(initialFiltros);
        setSortCriteria('rankingNacional');
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

    const handleSort = (criteria) => {
        if (sortCriteria === criteria) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCriteria(criteria);
            setSortDirection(criteria === 'rankingNacional' ? 'asc' : 'desc');
        }
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

    const sortButtonClass = (criteria) =>
        `px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-1 ${sortCriteria === criteria ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'
        }`;
    
    const areFiltersApplied = Object.values(filtros).some(value => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== '';
    });

    return (
        <div className="bg-slate-950 text-white min-h-screen font-inter">
            {!areFiltersApplied && (
                <div className="bg-slate-950 text-center py-12 px-8">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <FaSearch className="text-4xl text-amber-500" />
                        <h1 className="text-4xl font-bold text-amber-500">Busca por Faculdades</h1>
                    </div>
                    <p className="text-sm mt-2 text-white">
                        Encontre a faculdade perfeita para você. Busque, compare e gerencie sua jornada de aplicação em um só lugar.
                    </p>
                </div>
            )}

            <div className={`p-8 grid grid-cols-1 md:grid-cols-3 gap-8 ${baseTransition} ${showFilter ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
                <div className="md:sticky col-span-1 rounded-lg bg-slate-900 border border-slate-950 p-6 flex flex-col gap-4 h-fit max-h-[85vh] overflow-y-auto z-10 top-24">
                    <div className="flex items-center gap-2 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <h2 className="text-lg font-bold">Buscar e Filtrar</h2>
                    </div>
                    <CollegeFilter filtros={filtros} setFiltros={setFiltros} onClearFilters={handleClearFilters} />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <div className="flex justify-between items-center mb-4 flex-col sm:flex-row sm:items-center sm:gap-4">
                        <p className="text-lg font-semibold mb-2 sm:mb-0 text-white">{countText}</p>

                        <div className="flex gap-2 text-sm">
                            <button
                                onClick={() => handleSort('taxaAceitacao')}
                                className={sortButtonClass('taxaAceitacao')}
                            >
                                Taxa de Aceitação
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
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(filtros).map(([key, value]) => {
                            if (Array.isArray(value) && value.length > 0) {
                                return value.map(item => (
                                    <span key={`${key}-${item}`} className="bg-slate-900 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                                        <span className="text-amber-500">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {key === 'estado' ? getEstadoNome(item) : item}
                                        <button onClick={() => handleRemoveFilter(key, item)} className="text-white opacity-70 hover:opacity-100 transition-opacity">
                                            <FaTimesCircle />
                                        </button>
                                    </span>
                                ));
                            } else if (!Array.isArray(value) && value) {
                                return (
                                    <span key={key} className="bg-slate-900 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                                        <span className="text-amber-500">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
                                        <button onClick={() => handleRemoveFilter(key, '')} className="text-white opacity-70 hover:opacity-100 transition-opacity">
                                            <FaTimesCircle />
                                        </button>
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <CollegeList data={universidadesFiltradas} onClearFilters={handleClearFilters} />
                </div>
            </div>
        </div>
    );
};

export default CollegeListMain;