import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { oportunidades as oportunidadesOriginais } from '../utils/opportunitiesData';
import {
    FaHeart,
    FaExternalLinkAlt,
    FaChevronLeft,
    FaGlobeAmericas,
    FaClock,
    FaCalendarAlt,
    FaUser,
    FaGraduationCap,
    FaClipboardList,
    FaDollarSign,
    FaCheck,
    FaInfoCircle,
    FaFileAlt,
    FaMoneyBillWave,
    FaPaperclip,
    FaMapMarkerAlt,
    FaTimesCircle
} from 'react-icons/fa';


function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            const savedValue = item ? JSON.parse(item) : initialValue;
            if (!Array.isArray(savedValue)) {
                console.warn(`Local storage for key "${key}" is not an array. Resetting to initial value.`);
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
    if (typeof deadlineString !== 'string' || deadlineString.length < 10) return null;
    const parts = deadlineString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
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

const getScholarshipTagClasses = (tipoBolsa) => {
    switch (tipoBolsa?.toLowerCase()) {
        case 'parcial':
            return 'bg-amber-500 text-black';
        case 'completa':
            return 'bg-green-500 text-black';
        case 'sem bolsa':
            return 'bg-gray-500 text-black';
        default:
            return 'bg-slate-900 text-white';
    }
};

const OpportunitiesInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const oportunidade = oportunidadesOriginais.find(op => op.id === Number(id));
    const [favorites, setFavorites] = useLocalStorage("favorites", []);
    const [popup, setPopup] = useState({ visible: false, message: '' });
    const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, opportunity: null });
    const [activeTab, setActiveTab] = useState('sobre');

    const isFavorited = favorites.some(fav => fav.id === (oportunidade ? oportunidade.id : null));

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (popup.visible) {
            const timer = setTimeout(() => {
                setPopup({ ...popup, visible: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popup]);

    const handleFavoriteToggle = () => {
        if (oportunidade) {
            if (isFavorited) {
                setConfirmationPopup({ visible: true, opportunity: oportunidade });
            } else {
                setFavorites([...favorites, oportunidade]);
                setPopup({ visible: true, message: `Oportunidade adicionada aos seus Favoritos!` });
            }
        }
    };

    const handleConfirmRemove = () => {
        if (confirmationPopup.opportunity) {
            const updatedFavorites = favorites.filter(fav => fav.id !== confirmationPopup.opportunity.id);
            setFavorites(updatedFavorites);
            setPopup({ visible: true, message: `Oportunidade removida dos seus Favoritos.` });
        }
        setConfirmationPopup({ visible: false, opportunity: null });
    };

    const handleCancelRemove = () => {
        setConfirmationPopup({ visible: false, opportunity: null });
    };

    if (!oportunidade) {
        return (
            <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center">
                <p className="text-xl">Oportunidade não encontrada.</p>
            </div>
        );
    }

    const scholarshipClasses = getScholarshipTagClasses(oportunidade.tipoBolsa);
    const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'sobre':
                return (
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl border border-slate-950">
                        <h2 className="text-2xl font-bold mb-4 text-amber-500">Sobre o Programa</h2>
                        <p className="text-base text-white leading-relaxed mb-6">{oportunidade.descricao || 'N/A'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                             <div className="flex items-center space-x-3">
                                 <FaGlobeAmericas className="text-amber-500 flex-shrink-0" />
                                 <div>
                                     <p className="font-semibold text-amber-500">País de Destino</p>
                                     <p className="text-white">{oportunidade.pais || 'N/A'}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <FaMapMarkerAlt className="text-amber-500 flex-shrink-0" />
                                 <div>
                                     <p className="font-semibold text-amber-500">Cidade</p>
                                     <p className="text-white">{oportunidade.cidade || 'N/A'}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <FaGraduationCap className="text-amber-500 flex-shrink-0" />
                                 <div>
                                     <p className="font-semibold text-amber-500">Nível de Ensino</p>
                                     <p className="text-white">{oportunidade.nivelEnsino || 'N/A'}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <FaUser className="text-amber-500 flex-shrink-0" />
                                 <div>
                                     <p className="font-semibold text-amber-500">Faixa Etária</p>
                                     <p className="text-white">{oportunidade.faixaEtaria || 'N/A'}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <FaClock className="text-amber-500 flex-shrink-0" />
                                 <div>
                                     <p className="font-semibold text-amber-500">Duração</p>
                                     <p className="text-white">{oportunidade.duracao || 'N/A'}</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                );
            case 'requisitos':
                return (
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl border border-slate-950">
                        <h2 className="text-2xl font-bold mb-4 text-amber-500">Requisitos e Documentos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                            <div className="flex items-start space-x-3">
                                <FaFileAlt className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Requisitos Específicos</p>
                                    <p className="text-white">{oportunidade.requisitosEspecificos || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaGraduationCap className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Requisitos de Idioma</p>
                                    <p className="text-white">{oportunidade.requisitosIdioma || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaClipboardList className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Instituição Responsável</p>
                                    <p className="text-white">{oportunidade.instituicaoResponsavel || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'custos-bolsas':
                return (
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl border border-slate-950">
                        <h2 className="text-2xl font-bold mb-4 text-amber-500">Custos e Bolsas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                            <div className="flex items-start space-x-3">
                                <FaDollarSign className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Taxa de Aplicação</p>
                                    <p className="text-white">{oportunidade.taxaAplicacao || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaCheck className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Tipo de Bolsa</p>
                                    <p>
                                        <span className={`py-1 px-3 rounded-full font-bold text-sm uppercase ${scholarshipClasses}`}>
                                            {oportunidade.tipoBolsa || 'N/A'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaMoneyBillWave className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Cobertura da Bolsa</p>
                                    <p className="text-white">{oportunidade.coberturaBolsa || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaTimesCircle className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Custos Extras</p>
                                    <p className="text-white">{oportunidade.custosExtras || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'inscricao':
                return (
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl border border-slate-950">
                        <h2 className="text-2xl font-bold mb-4 text-amber-500">Processo de Inscrição</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                            <div className="flex items-start space-x-3">
                                <FaCalendarAlt className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Prazo de Inscrição</p>
                                    <p className="text-white">{oportunidade.prazoInscricao || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaClipboardList className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Etapas de Seleção</p>
                                    <p className="text-white">{oportunidade.etapasSelecao || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaPaperclip className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Processo de Inscrição</p>
                                    <p className="text-white">{oportunidade.processoInscricao || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaExternalLinkAlt className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Link Oficial</p>
                                    <a href={oportunidade.linkOficial} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
                                        {oportunidade.linkOficial || 'N/A'}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FaUser className="text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-amber-500">Contato</p>
                                    <p className="text-white">{oportunidade.contato || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-slate-950 text-white min-h-screen font-inter relative">
            <div className="relative h-96 overflow-hidden">
                <img
                    src={oportunidade.imagem}
                    alt={`Imagem de Capa para ${oportunidade.nome}`}
                    className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-8 md:p-16 pb-12 md:pb-24">
                    <div className="flex items-center text-white mb-2">
                        <FaGlobeAmericas className="mr-2" />
                        <span className="font-light text-sm md:text-base">{oportunidade.pais}</span>
                    </div>
                    <h1 className="text-2xl md:text-5xl font-extrabold text-white">
                        {oportunidade.nome}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="bg-slate-900 rounded-xl p-6 shadow-xl mb-8 border border-slate-950 flex flex-col md:flex-row md:justify-between md:items-center">
                    <button onClick={() => navigate(-1)} className="hidden md:flex items-center text-amber-500 hover:text-amber-600 transition-colors">
                        <FaChevronLeft className="mr-2" /> Voltar
                    </button>
                    
                    
                    <div className="flex justify-between items-center w-full md:hidden mb-4">
                        <button onClick={() => navigate(-1)} className="flex items-center text-amber-500 hover:text-amber-600 transition-colors">
                            <FaChevronLeft className="mr-2" /> Voltar
                        </button>
                    </div>

                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={handleFavoriteToggle}
                            className={`flex items-center justify-center font-bold py-2 px-6 rounded-full transition-colors duration-200
                            ${isFavorited ? 'bg-amber-500 text-black' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                        >
                            <FaHeart className={`mr-2 ${isFavorited ? 'text-black' : 'text-amber-500'}`} />
                            {isFavorited ? 'Remover' : 'Adicionar aos Favoritos'}
                        </button>
                        <a
                            href={oportunidade.linkOficial || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-amber-500 text-black font-bold py-2 px-6 rounded-full hover:bg-amber-600 transition-colors duration-300"
                        >
                            Aplicar agora <FaExternalLinkAlt className="ml-2" />
                        </a>
                    </div>

                </div>
                
                
                <div className="py-8">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('sobre')}
                            className={`px-4 py-2 rounded-full font-bold transition-colors text-sm md:text-base ${activeTab === 'sobre' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            <FaInfoCircle className="inline-block mr-2" /> Sobre
                        </button>
                        <button
                            onClick={() => setActiveTab('requisitos')}
                            className={`px-4 py-2 rounded-full font-bold transition-colors text-sm md:text-base ${activeTab === 'requisitos' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            <FaFileAlt className="inline-block mr-2" /> Requisitos
                        </button>
                        <button
                            onClick={() => setActiveTab('custos-bolsas')}
                            className={`px-4 py-2 rounded-full font-bold transition-colors text-sm md:text-base ${activeTab === 'custos-bolsas' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            <FaMoneyBillWave className="inline-block mr-2" /> Custos e Bolsas
                        </button>
                        <button
                            onClick={() => setActiveTab('inscricao')}
                            className={`px-4 py-2 rounded-full font-bold transition-colors text-sm md:text-base ${activeTab === 'inscricao' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            <FaPaperclip className="inline-block mr-2" /> Inscrição
                        </button>
                    </div>

                    {renderTabContent()}
                </div>
            </div>

            {popup.visible && (
                <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 animate-slideIn border border-slate-950">
                    <span>{popup.message}</span>
                    <button onClick={() => setPopup({ ...popup, visible: false })} className="text-white hover:text-gray-200">
                        &times;
                    </button>
                </div>
            )}
            {confirmationPopup.visible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-slate-900 p-8 rounded-lg shadow-xl text-center w-full max-w-md border border-slate-950">
                        <p className="text-lg text-white mb-6">
                            Tem certeza que deseja remover <span className="text-amber-500 font-semibold">{confirmationPopup.opportunity.nome}</span> dos seus Favoritos?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmRemove}
                                className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-600 transition-colors"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCancelRemove}
                                className="px-6 py-2 bg-slate-950 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunitiesInfo;