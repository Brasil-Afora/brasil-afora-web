import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CollegeFilter = ({ filtros, setFiltros, onClearFilters }) => {
    const [openFilter, setOpenFilter] = useState(null);
    const filterRef = useRef(null);

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

    const handleCheckboxChange = (id, value) => {
        setFiltros(prev => {
            const currentArray = prev[id] || [];
            if (currentArray.includes(value)) {
                return { ...prev, [id]: currentArray.filter(item => item !== value) };
            } else {
                return { ...prev, [id]: [...currentArray, value] };
            }
        });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const newId = id === 'faixaSAT' ? 'notaSAT' : id === 'faixaACT' ? 'notaACT' : id;
        setFiltros(prev => ({ ...prev, [newId]: value }));
    };
    
    const isFilterActive = () => {
        return Object.values(filtros).some(value => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value !== '';
        });
    };

    const toggleFilter = (filterName) => {
        setOpenFilter(openFilter === filterName ? null : filterName);
    };

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

    const testesProficiencia = ["TOEFL", "IELTS", "Duolingo English Test"];
    const politicasFinanceiras = ["need-blind", "need-based", "merit-based"];
    const inputClasses = "p-3 rounded-md bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 text-sm";
    const commonWidth = "w-full";

    const getEstadoPlaceholder = () => {
        const count = filtros.estado.length;
        if (count === 0) return "Todos os estados";
        if (count === 1) return estadosData.find(e => e.abbr === filtros.estado[0])?.nome || filtros.estado[0];
        return `${count} estados selecionados`;
    };

    const getTestesProficienciaPlaceholder = () => {
        const count = filtros.testesProficiencia.length;
        if (count === 0) return "Todos os testes";
        if (count === 1) return filtros.testesProficiencia[0];
        return `${count} testes selecionados`;
    };

    const getPoliticasFinanceirasPlaceholder = () => {
        const count = filtros.politicaFinanceira.length;
        if (count === 0) return "Todas as políticas";
        if (count === 1) return filtros.politicaFinanceira[0];
        return `${count} políticas selecionadas`;
    };

    const FilterDropdown = ({ title, placeholder, onToggle, isOpen, children }) => (
        <div className={commonWidth}>
            <label htmlFor={title} className="block text-sm text-white mb-1">
                <span className="text-amber-500">{title}</span>
            </label>
            <div className={`relative ${commonWidth}`}>
                <button
                    type="button"
                    className="p-3 rounded-md bg-slate-950 text-white border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 h-10 w-full flex justify-between items-center cursor-pointer text-sm"
                    onClick={onToggle}
                >
                    <span>{placeholder}</span>
                    {isOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {isOpen && (
                    <div className="absolute mt-1 left-0 z-20 w-full max-h-48 overflow-y-auto bg-slate-900 rounded-lg shadow-xl p-3 border border-slate-950">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const FilterCheckbox = ({ value, isChecked, onChange }) => (
        <label className="flex items-center space-x-2 cursor-pointer text-sm text-white p-1 hover:bg-slate-800 rounded">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className="rounded text-amber-500 bg-slate-950 border-slate-900 w-4 h-4"
            />
            <span>{value}</span>
        </label>
    );

    return (
        <div ref={filterRef} className="flex flex-col gap-4 font-inter">
            <FilterDropdown
                title="Estado"
                placeholder={getEstadoPlaceholder()}
                isOpen={openFilter === 'estado'}
                onToggle={() => toggleFilter('estado')}
            >
                {estadosData.sort((a, b) => a.nome.localeCompare(b.nome)).map((e, i) => (
                    <FilterCheckbox
                        key={i}
                        value={e.nome}
                        isChecked={filtros.estado.includes(e.abbr)}
                        onChange={() => handleCheckboxChange('estado', e.abbr)}
                    />
                ))}
            </FilterDropdown>

            <div className={commonWidth}>
                <label htmlFor="taxaAceitacao" className="block text-sm text-white mb-1">
                    <span className="text-amber-500">Taxa de Aceitação Mínima (%)</span>
                </label>
                <input
                    id="taxaAceitacao"
                    type="number"
                    value={filtros.taxaAceitacao}
                    onChange={handleInputChange}
                    className={`${inputClasses} w-full`}
                    placeholder="Ex: 10"
                />
            </div>
            
            <div className={commonWidth}>
                <label htmlFor="notaSAT" className="block text-sm text-white mb-1">
                    <span className="text-amber-500">Nota do SAT</span>
                </label>
                <input
                    id="notaSAT"
                    type="number"
                    value={filtros.notaSAT}
                    onChange={handleInputChange}
                    className={`${inputClasses} w-full`}
                    placeholder="Ex: 1500"
                />
            </div>

            <div className={commonWidth}>
                <label htmlFor="notaACT" className="block text-sm text-white mb-1">
                    <span className="text-amber-500">Nota do ACT</span>
                </label>
                <input
                    id="notaACT"
                    type="number"
                    value={filtros.notaACT}
                    onChange={handleInputChange}
                    className={`${inputClasses} w-full`}
                    placeholder="Ex: 33"
                />
            </div>

            <FilterDropdown
                title="Testes de Proficiência"
                placeholder={getTestesProficienciaPlaceholder()}
                isOpen={openFilter === 'testesProficiencia'}
                onToggle={() => toggleFilter('testesProficiencia')}
            >
                {testesProficiencia.sort().map((t, i) => (
                    <FilterCheckbox
                        key={i}
                        value={t}
                        isChecked={filtros.testesProficiencia.includes(t)}
                        onChange={() => handleCheckboxChange('testesProficiencia', t)}
                    />
                ))}
            </FilterDropdown>

            <FilterDropdown
                title="Política Financeira"
                placeholder={getPoliticasFinanceirasPlaceholder()}
                isOpen={openFilter === 'politicaFinanceira'}
                onToggle={() => toggleFilter('politicaFinanceira')}
            >
                {politicasFinanceiras.sort().map((p, i) => (
                    <FilterCheckbox
                        key={i}
                        value={p}
                        isChecked={filtros.politicaFinanceira.includes(p)}
                        onChange={() => handleCheckboxChange('politicaFinanceira', p)}
                    />
                ))}
            </FilterDropdown>

            <div className="mt-2 hidden md:block">
                <button
                    onClick={onClearFilters}
                    disabled={!isFilterActive()}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors duration-200
                        ${isFilterActive() ? 'bg-amber-500 hover:bg-amber-600 text-black' : 'bg-slate-900 text-slate-500 cursor-not-allowed'}`}
                >
                    Limpar Filtros
                </button>
            </div>
        </div>
    );
};

export default CollegeFilter;