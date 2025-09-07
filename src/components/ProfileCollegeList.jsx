import React, { useState, useMemo } from 'react';
import { FaTrash, FaChevronDown, FaChevronUp, FaSort, FaSortAmountUp, FaSortAmountDown, FaExternalLinkAlt, FaPlus, FaInfoCircle, FaCheckSquare } from 'react-icons/fa';

const ProfileCollegeList = ({ myCollegeList, applicationChecklist, setApplicationChecklist, handleRemoveFromList }) => {
    const [expandedDetailsUniId, setExpandedDetailsUniId] = useState(null);
    const [expandedChecklistUniId, setExpandedChecklistUniId] = useState(null);
    const [activeSection, setActiveSection] = useState('geral');
    const [showAddMenu, setShowAddMenu] = useState(null);
    const [customItem, setCustomItem] = useState('');
    const [completionConfirmation, setCompletionConfirmation] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [sortCriteria, setSortCriteria] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const sortedCollegeList = useMemo(() => {
        if (!sortCriteria) {
            return myCollegeList;
        }

        const sortedList = [...myCollegeList].sort((a, b) => {
            let valA, valB;

            switch (sortCriteria) {
                case 'taxaAceitacao':
                    valA = parseFloat(a.taxaAceitacao.replace('%', '')) || 0;
                    valB = parseFloat(b.taxaAceitacao.replace('%', '')) || 0;
                    break;
                case 'anuidade':
                    valA = parseFloat(a.tuition.replace(/[^0-9.]/g, '')) || 0;
                    valB = parseFloat(b.tuition.replace(/[^0-9.]/g, '')) || 0;
                    break;
                case 'indiceAjuda':
                    valA = parseFloat(a.averageNeedBasedAidPackage?.replace(/[^0-9.]/g, '')) || 0;
                    valB = parseFloat(b.averageNeedBasedAidPackage?.replace(/[^0-9.]/g, '')) || 0;
                    break;
                default:
                    return 0;
            }

            if (sortDirection === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        });
        
        return sortedList;
    }, [myCollegeList, sortCriteria, sortDirection]);

    const handleToggleDetails = (id) => {
        setExpandedDetailsUniId(expandedDetailsUniId === id ? null : id);
        setExpandedChecklistUniId(null);
        setActiveSection('geral');
    };
    
    const handleToggleChecklist = (id) => {
        setExpandedChecklistUniId(expandedChecklistUniId === id ? null : id);
        setExpandedDetailsUniId(null);
        if (!applicationChecklist[id]) {
            setApplicationChecklist(prev => ({ ...prev, [id]: [] }));
        }
    };
    
    const handleSort = (criteria) => {
        if (criteria === sortCriteria) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCriteria(criteria);
            setSortDirection('asc');
        }
    };

    const handleAddItem = (uniId, itemText) => {
        if (itemText.trim() === '') return;
        setApplicationChecklist(prev => {
            const newChecklist = { ...prev };
            newChecklist[uniId] = [...(newChecklist[uniId] || []), { text: itemText, completed: false }];
            return newChecklist;
        });
        setCustomItem('');
        setShowAddMenu(null);
    };

    const handleChecklistItem = (uniId, itemIndex) => {
        const itemStatus = applicationChecklist[uniId][itemIndex].completed;
        setCompletionConfirmation({ uniId, itemIndex, isCompleted: itemStatus });
    };

    const handleConfirmCompletion = () => {
        const { uniId, itemIndex } = completionConfirmation;
        setApplicationChecklist(prev => {
            const newChecklist = { ...prev };
            const checklist = [...newChecklist[uniId]];
            checklist[itemIndex] = { ...checklist[itemIndex], completed: !checklist[itemIndex].completed };
            newChecklist[uniId] = checklist;
            return newChecklist;
        });
        setCompletionConfirmation(null);
    };

    const handleCancelCompletion = () => {
        setCompletionConfirmation(null);
    };

    const handleDeleteItem = (uniId, itemIndex) => {
        setDeleteConfirmation({ uniId, itemIndex });
    };

    const handleConfirmDelete = () => {
        const { uniId, itemIndex } = deleteConfirmation;
        setApplicationChecklist(prev => {
            const newChecklist = { ...prev };
            const checklist = [...newChecklist[uniId]];
            checklist.splice(itemIndex, 1);
            newChecklist[uniId] = checklist;
            return newChecklist;
        });
        setDeleteConfirmation(null);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const getSortIcon = (criteria) => {
        if (sortCriteria === criteria) {
            return sortDirection === 'asc' ? <FaSortAmountUp className="text-xl" /> : <FaSortAmountDown className="text-xl" />;
        }
        return <FaSort className="text-xl text-white" />;
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-4 text-amber-500">Minha College List</h2>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="font-semibold text-lg text-white min-w-[120px]">Ordenar por:</span>
                <button
                    onClick={() => handleSort('taxaAceitacao')}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-200 text-sm md:text-base ${sortCriteria === 'taxaAceitacao' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                    Taxa de Aceitação
                    {getSortIcon('taxaAceitacao')}
                </button>
                <button
                    onClick={() => handleSort('anuidade')}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-200 text-sm md:text-base ${sortCriteria === 'anuidade' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                    Anuidade
                    {getSortIcon('anuidade')}
                </button>
                <button
                    onClick={() => handleSort('indiceAjuda')}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-200 text-sm md:text-base ${sortCriteria === 'indiceAjuda' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                    Índice de Ajuda
                    {getSortIcon('indiceAjuda')}
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {sortedCollegeList.length > 0 ? (
                    sortedCollegeList.map(uni => {
                        const cidade = uni.cidade || 'N/A';
                        const estado = uni.estado || 'N/A';
                        
                        const checklistItems = applicationChecklist[uni.id] || [];
                        const completedItems = checklistItems.filter(item => item.completed).length;
                        const totalItems = checklistItems.length;
                        const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
                        const progressText = `${progressPercentage}%`;
                        
                        return (
                            <div key={uni.id} className="bg-slate-900 p-4 md:p-6 rounded-lg shadow-xl flex flex-col gap-4 border border-slate-950">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-white">
                                            <h3 className="text-xl md:text-2xl font-bold">{uni.nome}</h3>
                                            <span className="text-base md:text-lg font-medium text-amber-500">({progressText})</span>
                                        </div>
                                        <p className="text-sm md:text-base text-white">{cidade}, {estado}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 md:ml-auto">
                                        <a
                                            href={uni.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-slate-950 text-amber-500 font-bold py-3 px-4 rounded-full text-center text-xs md:text-sm hover:scale-105 transition-transform duration-200 flex items-center hover:bg-slate-800"
                                            title="Visitar site"
                                        >
                                            <FaExternalLinkAlt className="mr-2" /> Visitar
                                        </a>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleToggleDetails(uni.id); }}
                                            className={`py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center font-bold gap-2 text-xs md:text-sm ${expandedDetailsUniId === uni.id ? 'bg-amber-500 text-black' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                                            title="Ver detalhes"
                                        >
                                            <FaInfoCircle /> <span className="hidden md:inline">Detalhes</span>
                                            {expandedDetailsUniId === uni.id ? <FaChevronUp className="md:hidden" /> : <FaChevronDown className="md:hidden" />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleToggleChecklist(uni.id); }}
                                            className={`py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 font-bold text-xs md:text-sm ${expandedChecklistUniId === uni.id ? 'bg-amber-500 text-black' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                                            title="Ver checklist"
                                        >
                                            <FaCheckSquare /> <span className="hidden md:inline">Checklist</span>
                                            {expandedChecklistUniId === uni.id ? <FaChevronUp className="md:hidden" /> : <FaChevronDown className="md:hidden" />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveFromList(uni.id, "myCollegeList", uni.nome); }}
                                            className="bg-slate-950 hover:bg-slate-800 transition-colors duration-200 text-red-500 rounded-full w-8 h-8 flex items-center justify-center"
                                            title="Remover da lista"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {expandedDetailsUniId === uni.id && (
                                    <div className="mt-4 border-t border-slate-950 pt-4">
                                        <h4 className="text-xl font-bold mb-2 text-amber-500">Detalhes da Universidade</h4>
                                        
                                       
                                        <div className="md:hidden flex flex-wrap justify-center gap-2 mb-4">
                                            <button 
                                                onClick={() => setActiveSection('geral')}
                                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeSection === 'geral' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}
                                            >
                                                Geral
                                            </button>
                                            <button 
                                                onClick={() => setActiveSection('academico')}
                                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeSection === 'academico' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}
                                            >
                                                Acadêmico
                                            </button>
                                            <button 
                                                onClick={() => setActiveSection('custos')}
                                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeSection === 'custos' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}
                                            >
                                                Custos & Bolsas
                                            </button>
                                            <button 
                                                onClick={() => setActiveSection('application')}
                                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeSection === 'application' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}
                                            >
                                                Application
                                            </button>
                                        </div>

                                        
                                        <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8">
                                            
                                            <div>
                                                <h5 className="text-lg font-bold text-white mb-2">Geral</h5>
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Tipo de Campus:</span> <span>{uni.setting}</span></p>
                                                    <p><span className="font-semibold text-white">Ranking Nacional:</span> <span>{uni.rankingNacional}</span></p>
                                                    <p><span className="font-semibold text-white">Total de Alunos:</span> <span>{uni.totalAlunos}</span></p>
                                                    <p><span className="font-semibold text-white">Percentual de Internacionais:</span> <span>{uni.percentualInternacionais}</span></p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h5 className="text-lg font-bold text-white mb-2">Acadêmico</h5>
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Taxa de Aceitação:</span> <span>{uni.taxaAceitacao}</span></p>
                                                    <p><span className="font-semibold text-white">Faixa de SAT:</span> <span>{uni.faixaSAT}</span></p>
                                                    <p><span className="font-semibold text-white">Faixa de ACT:</span> <span>{uni.faixaACT}</span></p>
                                                    <p><span className="font-semibold text-white">Taxa de Graduação (4 anos):</span> <span>{uni.graduationRate4anos}</span></p>
                                                    <p><span className="font-semibold text-white">Salário Médio (6 anos):</span> <span>{uni.medianSalary6anos}</span></p>
                                                    <p><span className="font-semibold text-white">Cursos Populares:</span> <span>{uni.majorsPrincipais}</span></p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h5 className="text-lg font-bold text-white mb-2">Custos & Bolsas</h5>
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Anuidade:</span> <span>{uni.tuition}</span></p>
                                                    <p><span className="font-semibold text-white">Moradia e Alimentação:</span> <span>{uni.roomBoard}</span></p>
                                                    <p><span className="font-semibold text-white">Custo Médio Pós-Auxílio:</span> <span>{uni.averageCostAfterAid}</span></p>
                                                    <p><span className="font-semibold text-white">Pacote de Auxílio Médio:</span> <span>{uni.averageNeedBasedAidPackage}</span></p>
                                                    <p><span className="font-semibold text-white">Política Financeira:</span> <span>{uni.politicaFinanceira}</span></p>
                                                    <p><span className="font-semibold text-white">Tipos de Bolsa:</span> <span>{uni.tiposBolsa}</span></p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h5 className="text-lg font-bold text-white mb-2">Application</h5>
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Taxa de Inscrição:</span> <span>{uni.applicationFee}</span></p>
                                                    <p><span className="font-semibold text-white">Plataforma de Inscrição:</span> <span>{uni.plataformaInscricao}</span></p>
                                                    <p><span className="font-semibold text-white">Tipos de Aplicação:</span> <span>{uni.tiposAplicacao}</span></p>
                                                    <p><span className="font-semibold text-white">Testes de Proficiência:</span> <span>{uni.testesProficiencia}</span></p>
                                                    <p><span className="font-semibold text-white">Contato:</span> <span>{uni.contato}</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        
                                        <div className="md:hidden">
                                            {activeSection === 'geral' && (
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Tipo de Campus:</span> <span>{uni.setting}</span></p>
                                                    <p><span className="font-semibold text-white">Ranking Nacional:</span> <span>{uni.rankingNacional}</span></p>
                                                    <p><span className="font-semibold text-white">Total de Alunos:</span> <span>{uni.totalAlunos}</span></p>
                                                    <p><span className="font-semibold text-white">Percentual de Internacionais:</span> <span>{uni.percentualInternacionais}</span></p>
                                                </div>
                                            )}
                                            {activeSection === 'academico' && (
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Taxa de Aceitação:</span> <span>{uni.taxaAceitacao}</span></p>
                                                    <p><span className="font-semibold text-white">Faixa de SAT:</span> <span>{uni.faixaSAT}</span></p>
                                                    <p><span className="font-semibold text-white">Faixa de ACT:</span> <span>{uni.faixaACT}</span></p>
                                                    <p><span className="font-semibold text-white">Taxa de Graduação (4 anos):</span> <span>{uni.graduationRate4anos}</span></p>
                                                    <p><span className="font-semibold text-white">Salário Médio (6 anos):</span> <span>{uni.medianSalary6anos}</span></p>
                                                    <p><span className="font-semibold text-white">Cursos Populares:</span> <span>{uni.majorsPrincipais}</span></p>
                                                </div>
                                            )}
                                            {activeSection === 'custos' && (
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Anuidade:</span> <span>{uni.tuition}</span></p>
                                                    <p><span className="font-semibold text-white">Moradia e Alimentação:</span> <span>{uni.roomBoard}</span></p>
                                                    <p><span className="font-semibold text-white">Custo Médio Pós-Auxílio:</span> <span>{uni.averageCostAfterAid}</span></p>
                                                    <p><span className="font-semibold text-white">Pacote de Auxílio Médio:</span> <span>{uni.averageNeedBasedAidPackage}</span></p>
                                                    <p><span className="font-semibold text-white">Política Financeira:</span> <span>{uni.politicaFinanceira}</span></p>
                                                    <p><span className="font-semibold text-white">Tipos de Bolsa:</span> <span>{uni.tiposBolsa}</span></p>
                                                </div>
                                            )}
                                            {activeSection === 'application' && (
                                                <div className="flex flex-col gap-1 text-slate-400 text-sm">
                                                    <p><span className="font-semibold text-white">Taxa de Inscrição:</span> <span>{uni.applicationFee}</span></p>
                                                    <p><span className="font-semibold text-white">Plataforma de Inscrição:</span> <span>{uni.plataformaInscricao}</span></p>
                                                    <p><span className="font-semibold text-white">Tipos de Aplicação:</span> <span>{uni.tiposAplicacao}</span></p>
                                                    <p><span className="font-semibold text-white">Testes de Proficiência:</span> <span>{uni.testesProficiencia}</span></p>
                                                    <p><span className="font-semibold text-white">Contato:</span> <span>{uni.contato}</span></p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {expandedChecklistUniId === uni.id && (
                                    <div className="mt-4 border-t border-slate-950 pt-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-bold text-amber-500">
                                                Checklist da Aplicação
                                                <span className="ml-2 text-sm font-normal text-white">({completedItems}/{totalItems})</span>
                                            </h4>
                                        </div>
                                        
                                        <p className="text-sm text-white mb-4">
                                            Adicione abaixo todos os documentos e etapas que você precisa enviar para sua inscrição. Vá marcando o que já foi concluído e acompanhe seu progresso de forma organizada.
                                        </p>
                                        
                                        <div className="mb-4">
                                            {showAddMenu === uni.id ? (
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={customItem}
                                                        onChange={(e) => setCustomItem(e.target.value)}
                                                        placeholder="Novo item"
                                                        className="flex-1 p-2 rounded-md bg-slate-900 text-white text-sm border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAddItem(uni.id, customItem)}
                                                            className="bg-amber-500 text-black font-bold py-2 px-3 rounded-md text-sm whitespace-nowrap"
                                                        >
                                                            Adicionar
                                                        </button>
                                                        <button
                                                            onClick={() => setShowAddMenu(null)}
                                                            className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-md transition-colors"
                                                            title="Cancelar"
                                                        >
                                                            <FaChevronUp />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setShowAddMenu(uni.id)} 
                                                    className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 transition-colors text-white"
                                                    title="Adicionar item"
                                                >
                                                    <FaPlus />
                                                </button>
                                            )}
                                        </div>

                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
                                            {checklistItems.map((item, itemIndex) => (
                                                <li 
                                                    key={itemIndex} 
                                                    className={`flex items-start justify-between p-3 rounded-lg border border-slate-950 transition-colors duration-200 ${item.completed ? 'bg-slate-950' : 'bg-slate-900 hover:bg-slate-800'}`}
                                                >
                                                    <div className="flex items-start space-x-3 flex-1 cursor-pointer" onClick={() => handleChecklistItem(uni.id, itemIndex)}>
                                                        <input 
                                                            type="checkbox"
                                                            checked={item.completed}
                                                            onChange={() => handleChecklistItem(uni.id, itemIndex)}
                                                            className="mt-1 rounded text-amber-500 bg-slate-950 border-slate-900 focus:ring-amber-500"
                                                        />
                                                        <span className={`text-sm break-words ${item.completed ? 'line-through text-white' : 'text-white'}`}>
                                                            {item.text}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteItem(uni.id, itemIndex); }}
                                                        className="p-1 rounded-full text-white hover:bg-slate-950 transition-colors ml-2"
                                                        title="Remover item"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-white text-center col-span-full">
                        Sua College List está vazia.
                    </p>
                )}
            </div>
            
            {completionConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl text-center w-full max-w-md border border-slate-950">
                        <p className="text-lg text-white mb-6">
                            {completionConfirmation.isCompleted ? "Tem certeza que deseja marcar esta tarefa como não concluída?" : "Essa tarefa foi concluída?"}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmCompletion}
                                className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-600 transition-colors"
                            >
                                Sim
                            </button>
                            <button
                                onClick={handleCancelCompletion}
                                className="px-6 py-2 bg-slate-950 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl text-center w-full max-w-md border border-slate-950">
                        <p className="text-lg text-white mb-6">
                            Tem certeza que deseja remover este item?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-600 transition-colors"
                            >
                                Sim
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="px-6 py-2 bg-slate-950 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCollegeList;