import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaExternalLinkAlt, FaPlus, FaChevronDown, FaChevronUp, FaTimesCircle } from 'react-icons/fa';

// O HOOK CORRIGIDO
function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            const savedValue = item ? JSON.parse(item) : initialValue;

            // Garante que o valor salvo é um array, senão retorna o valor inicial
            if (!Array.isArray(savedValue)) {
                console.warn(`Local storage para a chave "${key}" não é um array. Redefinindo para o valor inicial.`);
                return initialValue;
            }
            
            return savedValue;
        } catch (error) {
            console.error("Erro ao ler do Local Storage:", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Erro ao salvar no Local Storage:", error);
        }
    }, [key, value]);

    return [value, setValue];
}

const getTimeRemaining = (deadlineString) => {
    if (typeof deadlineString !== 'string' || deadlineString.length < 10) {
        return null;
    }
    
    // A lógica foi alterada para o novo formato DD/MM/YYYY
    const parts = deadlineString.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexed
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return null;
    }

    const deadline = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeDiff = deadline.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining > 0 && daysRemaining <= 31) {
        return `Faltam ${daysRemaining} dias`;
    }
    return null;
};

const ProfileOpportunities = ({ favoriteOpportunities, handleRemoveFromList }) => {
    const [expandedOportunidadeId, setExpandedOportunidadeId] = useState(null);
    const [checklistItems, setChecklistItems] = useLocalStorage("oportunidadesChecklist", {});
    const [customItem, setCustomItem] = useState('');
    const [showAddMenu, setShowAddMenu] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const handleToggleExpand = (id) => {
        setExpandedOportunidadeId(expandedOportunidadeId === id ? null : id);
        setShowAddMenu(null);
    };

    const handleAddItem = (oportunidadeId, itemText) => {
        if (itemText.trim() === '') return;
        setChecklistItems(prev => {
            const newChecklist = { ...prev };
            newChecklist[oportunidadeId] = [...(newChecklist[oportunidadeId] || []), { text: itemText, completed: false }];
            return newChecklist;
        });
        setCustomItem('');
        setShowAddMenu(null);
    };

    const handleChecklistItem = (oportunidadeId, itemIndex) => {
        setChecklistItems(prev => {
            const newChecklist = { ...prev };
            const checklist = [...newChecklist[oportunidadeId]];
            checklist[itemIndex] = { ...checklist[itemIndex], completed: !checklist[itemIndex].completed };
            newChecklist[oportunidadeId] = checklist;
            return newChecklist;
        });
    };

    const handleDeleteItem = (oportunidadeId, itemIndex) => {
        setDeleteConfirmation({ oportunidadeId, itemIndex });
    };

    const handleConfirmDelete = () => {
        const { oportunidadeId, itemIndex } = deleteConfirmation;
        setChecklistItems(prev => {
            const newChecklist = { ...prev };
            const checklist = [...newChecklist[oportunidadeId]];
            checklist.splice(itemIndex, 1);
            newChecklist[oportunidadeId] = checklist;
            return newChecklist;
        });
        setDeleteConfirmation(null);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation(null);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4 text-amber-500">Intercâmbios Salvos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {favoriteOpportunities.length > 0 ? (
                    favoriteOpportunities.map(oportunidade => {
                        const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao);
                        const isExpanded = expandedOportunidadeId === oportunidade.id;
                        const items = checklistItems[oportunidade.id] || [];
                        const completedCount = items.filter(item => item.completed).length;
                        const totalCount = items.length;
                        const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                        return (
                            <div
                                key={oportunidade.id}
                                className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg relative flex flex-col border border-slate-950"
                            >
                                {progressPercentage > 0 && (
                                    <div className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full bg-slate-950 text-amber-500 text-xs font-bold flex items-center justify-center">
                                        {progressPercentage}%
                                    </div>
                                )}
                                {timeRemaining && (
                                    <div className="absolute top-4 right-4 z-10 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                                        {timeRemaining}
                                    </div>
                                )}
                                <div className="relative h-44">
                                    <img src={oportunidade.imagem} alt="Imagem de Capa" className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{oportunidade.nome}</h3>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col text-white flex-grow">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center text-sm space-x-5">
                                            <div className="flex items-center space-x-2">
                                                <FaMapMarkerAlt className="text-amber-500" />
                                                <span className="font-semibold text-amber-500">País:</span>
                                            </div>
                                            <span className="text-white">{oportunidade.pais}</span>
                                        </div>
                                        <div className="flex space-x-2 items-center text-sm">
                                            <div className="flex items-center space-x-2">
                                                <FaCalendarAlt className="text-amber-500" />
                                                <span className="font-semibold text-amber-500">Prazo:</span>
                                            </div>
                                            <span className="text-white">{oportunidade.prazoInscricao}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <Link
                                            to={`/oportunidades/${oportunidade.id}`}
                                            className="bg-slate-950 text-amber-500 font-bold py-2 px-4 rounded-full text-center text-sm hover:bg-slate-800 transition-colors duration-200"
                                        >
                                            Ver Detalhes
                                        </Link>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleRemoveFromList(oportunidade.id, "favorites", oportunidade.nome)}
                                                className="bg-slate-950 hover:bg-slate-800 transition-colors duration-200 text-red-500 rounded-full w-8 h-8 flex items-center justify-center"
                                                title="Remover dos favoritos"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleExpand(oportunidade.id)}
                                                className="bg-slate-950 hover:bg-slate-800 transition-colors duration-200 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                                title="Ver checklist"
                                            >
                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        </div>
                                    </div>
                                    {isExpanded && (
                                        <div className="mt-4 border-t border-slate-950 pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-amber-500">Checklist <span className="text-white font-normal">({completedCount}/{totalCount})</span></h4>
                                                <button
                                                    onClick={() => setShowAddMenu(showAddMenu === oportunidade.id ? null : oportunidade.id)}
                                                    className="bg-slate-950 hover:bg-slate-800 text-white rounded-full p-2 text-sm"
                                                >
                                                    {showAddMenu === oportunidade.id ? <FaChevronUp /> : <FaPlus />}
                                                </button>
                                            </div>
                                            <p className="text-sm text-white mb-4">
                                                Acompanhe suas tarefas de aplicação, como documentos e prazos, para esta oportunidade.
                                            </p>
                                            {showAddMenu === oportunidade.id && (
                                                <div className="flex gap-2 mb-4">
                                                    <input
                                                        type="text"
                                                        value={customItem}
                                                        onChange={(e) => setCustomItem(e.target.value)}
                                                        placeholder="Novo item da checklist"
                                                        className="flex-1 p-2 rounded-md bg-slate-950 text-white text-sm border border-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                    />
                                                    <button
                                                        onClick={() => handleAddItem(oportunidade.id, customItem)}
                                                        className="bg-amber-500 text-black font-bold py-2 px-3 rounded-md text-sm"
                                                    >
                                                        Adicionar
                                                    </button>
                                                </div>
                                            )}
                                            <ul className="space-y-2">
                                                {items.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-900"
                                                    >
                                                        <div className="flex items-center space-x-2 flex-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.completed}
                                                                onChange={() => handleChecklistItem(oportunidade.id, index)}
                                                                className="rounded text-amber-500 bg-slate-900 border-slate-900 focus:ring-amber-500"
                                                            />
                                                            <span className={`text-sm ${item.completed ? 'line-through text-white' : 'text-white'}`}>
                                                                {item.text}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteItem(oportunidade.id, index)}
                                                            className="text-white hover:text-red-500 transition-colors"
                                                            title="Remover item"
                                                        >
                                                            <FaTimesCircle />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-white text-center col-span-full">
                        Você ainda não salvou nenhum intercâmbio.
                    </p>
                )}
            </div>
            {deleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
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

export default ProfileOpportunities;