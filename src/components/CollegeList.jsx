import React, { useState, useEffect, useMemo } from 'react';
import { FaMapMarkerAlt, FaUserGraduate, FaChevronDown, FaChevronUp, FaStar, FaInfoCircle, FaDollarSign, FaPercent, FaBriefcase, FaGraduationCap, FaExternalLinkAlt, FaEnvelope, FaBookOpen, FaUserTie } from 'react-icons/fa';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';
import logo from "../assets/logo.png";
import ReactDOM from 'react-dom';

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
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

const ConfirmationPopup = ({ visible, university, onConfirm, onCancel }) => {
    if (!visible) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[9999]">
            <div className="bg-slate-900 p-8 rounded-lg shadow-xl text-center w-full max-w-md border border-slate-950">
                <p className="text-lg text-white mb-6">
                    Tem certeza que deseja remover <span className="text-amber-500 font-semibold">{university && university.nome || 'esta faculdade'}</span> da sua lista?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-600 transition-colors"
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-slate-950 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const CollegeList = ({ data, onClearFilters }) => {
    const [myCollegeList, setMyCollegeList] = useLocalStorage("myCollegeList", []);
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [activeSection, setActiveSection] = useState('geral');
    const [popup, setPopup] = useState({ visible: false, message: '' });
    const [confirmationPopup, setConfirmationPopup] = useState({ visible: false, university: null });

    useEffect(() => {
        if (popup.visible) {
            const timer = setTimeout(() => {
                setPopup({ ...popup, visible: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popup]);

    const handleAddOrRemoveFromList = (university, event) => {
        const isAlreadyAdded = myCollegeList.some(uni => uni.id === university.id);
        if (event) {
            event.stopPropagation();
        }

        if (isAlreadyAdded) {
            setConfirmationPopup({ visible: true, university });
        } else {
            setMyCollegeList([...myCollegeList, university]);
            setPopup({ visible: true, message: `${university.nome} adicionada à sua College List!` });
        }
    };

    const handleConfirmRemove = () => {
        if (confirmationPopup.university) {
            const updatedList = myCollegeList.filter(uni => uni.id !== confirmationPopup.university.id);
            setMyCollegeList(updatedList);
            setPopup({ visible: true, message: `${confirmationPopup.university.nome} removida da sua College List.` });
        }
        setConfirmationPopup({ visible: false, university: null });
    };

    const handleCancelRemove = () => {
        setConfirmationPopup({ visible: false, university: null });
    };

    const handleToggleExpand = (id) => {
        setExpandedCardId(expandedCardId === id ? null : id);
        if (expandedCardId !== id) {
            setActiveSection('geral');
        }
    };

    const handleSectionToggle = (section, event) => {
        if (event) {
            event.stopPropagation();
        }
        setActiveSection(section);
    };
    
    
    const getBorderColorClass = (acceptanceRate) => {
        const rate = Number(acceptanceRate.replace('%', ''));
        if (rate >= 0 && rate <= 5) return 'border-red-500';
        if (rate >= 6 && rate <= 10) return 'border-orange-500';
        if (rate >= 11 && rate <= 20) return 'border-yellow-500';
        if (rate >= 21 && rate <= 50) return 'border-blue-500';
        if (rate >= 51 && rate <= 100) return 'border-green-500';
        return 'border-slate-900';
    };

    const getAcceptanceRateTextColor = (acceptanceRate) => {
        const rate = Number(acceptanceRate.replace('%', ''));
        if (rate >= 0 && rate <= 5) return 'text-red-500';
        if (rate >= 6 && rate <= 10) return 'text-orange-500';
        if (rate >= 11 && rate <= 20) return 'text-yellow-500';
        if (rate >= 21 && rate <= 50) return 'text-blue-500';
        if (rate >= 51 && rate <= 100) return 'text-green-500';
        return 'text-white';
    };

    const formatData = (value) => {
        if (value === null || value === undefined || value === 'N/A' || value === '') {
            return 'N/A';
        }
        if (typeof value === 'string') {
            const num = Number(value.replace(/[^0-9.]/g, ''));
            if (!isNaN(num) && value.includes('$')) {
                return `$${num.toLocaleString('pt-BR')}`;
            }
            if (!isNaN(num) && value.includes('%')) {
                return `${num}%`;
            }
        }
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR');
        }
        return value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
    };

    const renderInfoItem = (label, value) => {
        const formattedValue = formatData(value);
        if (formattedValue === 'N/A') return null;
        return (
            <div className="flex flex-col items-start gap-1 p-2 bg-slate-800 rounded-md col-span-1 md:col-span-1">
                <span className="text-xs font-medium text-amber-500">{label}</span>
                <span className="text-sm text-white font-semibold">{formattedValue}</span>
            </div>
        );
    };

    const renderMultiLineItem = (icon, label, value) => {
        const formattedValue = value ? value.split(', ').join(', ') : 'N/A';
        if (formattedValue === 'N/A' || formattedValue === null) return null;

        return (
            <div className="flex flex-col items-start gap-1 p-2 bg-slate-800 rounded-md col-span-1 md:col-span-1">
                <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
                    {icon} {label}
                </span>
                <span className="text-sm text-white">{formattedValue}</span>
            </div>
        );
    };

    const renderIconInfo = (icon, label, value) => {
        const formattedValue = formatData(value);
        if (formattedValue === 'N/A') return null;
        return (
            <div className="flex flex-col items-start gap-1 p-2 bg-slate-800 rounded-md col-span-1 md:col-span-1">
                <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
                    {icon} {label}
                </span>
                <span className="text-sm text-white font-semibold">{formattedValue}</span>
            </div>
        );
    };
    
    return (
        <div className="p-4 sm:p-0">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-4 font-inter">
                    {data.length > 0 ? (
                        data.map((uni) => {
                            const isExpanded = expandedCardId === uni.id;
                            const isAlreadyAdded = myCollegeList.some(item => item.id === uni.id);

                            return (
                                <div
                                    key={uni.id}
                                    className={`relative w-full text-left bg-slate-900 rounded-lg shadow-lg border-2 ${getBorderColorClass(uni.taxaAceitacao)} transition-all duration-300 transform hover:scale-[1.01] cursor-pointer`}
                                    onClick={() => handleToggleExpand(uni.id)}
                                >
                                    <div className="w-full flex flex-col p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-grow">
                                                <h2 className="text-xl font-semibold text-white">{uni.nome}</h2>
                                                <div className="flex items-center gap-2 text-white mt-1">
                                                    <FaMapMarkerAlt className="w-4 h-4 text-amber-500" />
                                                    <p className="text-sm">{uni.cidade}, {uni.estado}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleAddOrRemoveFromList(uni, e)}
                                                className={`p-2 rounded-full transition-colors duration-300 ${isAlreadyAdded ? 'text-amber-500 hover:text-white' : 'text-slate-500 hover:text-amber-500'}`}
                                            >
                                                {isAlreadyAdded ? <RiHeartFill className="h-6 w-6" /> : <RiHeartLine className="h-6 w-6" />}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-2 items-center">
                                            <div className="flex-1">
                                                <span className="font-semibold text-amber-500">Aceitação:</span>
                                                <p className={`text-sm ${getAcceptanceRateTextColor(uni.taxaAceitacao)} mt-1`}>{uni.taxaAceitacao}</p>
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-amber-500">Anuidade:</span>
                                                <p className="text-sm text-white mt-1">{formatData(uni.tuition)}</p>
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-amber-500">Ranking:</span>
                                                <p className="text-sm text-white mt-1">{formatData(uni.rankingNacional)}</p>
                                            </div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="font-semibold text-amber-500">Alunos:</span>
                                                <div className="flex items-center justify-between w-full">
                                                    <p className="text-sm text-white font-semibold">{formatData(uni.totalAlunos)}</p>
                                                    <div className="flex items-center gap-2 text-white opacity-70 transition-opacity">
                                                        {isExpanded ? (
                                                            <FaChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <FaChevronDown className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-6 pt-0 border-t border-slate-950">
                                            <div className="flex flex-wrap justify-center gap-2 mb-4 mt-2">
                                                <button
                                                    onClick={(e) => handleSectionToggle('geral', e)}
                                                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${activeSection === 'geral' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                                >
                                                    Geral
                                                </button>
                                                <button
                                                    onClick={(e) => handleSectionToggle('academico', e)}
                                                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${activeSection === 'academico' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                                >
                                                    Acadêmico
                                                </button>
                                                <button
                                                    onClick={(e) => handleSectionToggle('custos', e)}
                                                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${activeSection === 'custos' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                                >
                                                    Custos e Bolsas
                                                </button>
                                                <button
                                                    onClick={(e) => handleSectionToggle('application', e)}
                                                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${activeSection === 'application' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                                >
                                                    Application
                                                </button>
                                            </div>

                                            
                                            {activeSection === 'geral' && (
                                                <div className="grid md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg shadow-inner border border-slate-900">
                                                    {renderIconInfo(<FaMapMarkerAlt />, 'Localização', `${uni.cidade}, ${uni.estado}`)}
                                                    {renderInfoItem('Tipo de Campus', uni.setting)}
                                                    {renderIconInfo(<FaUserGraduate />, 'Total de Alunos', uni.totalAlunos)}
                                                    {renderInfoItem('Taxa de Graduação (4 anos)', uni.graduationRate4anos)}
                                                    {renderInfoItem('Salário Mediano (6 anos)', uni.medianSalary6anos)}
                                                    {renderMultiLineItem(<FaStar />, 'Cursos Populares', uni.majorsPrincipais)}
                                                </div>
                                            )}

                                            {activeSection === 'academico' && (
                                                <div className="grid md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg shadow-inner border border-slate-900">
                                                    {renderIconInfo(<FaBookOpen />, 'Faixa de SAT', uni.faixaSAT)}
                                                    {renderIconInfo(<FaBriefcase />, 'Faixa de ACT', uni.faixaACT)}
                                                    {renderMultiLineItem(<FaGraduationCap />, 'Testes de Proficiência', uni.testesProficiencia)}
                                                    {renderInfoItem('Pode-se Transferir?', uni.creditTransfer)}
                                                </div>
                                            )}

                                            {activeSection === 'custos' && (
                                                <div className="grid md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg shadow-inner border border-slate-900">
                                                    {renderIconInfo(<FaDollarSign />, 'Anuidade', uni.tuition)}
                                                    {renderInfoItem('Custo de Moradia/Alimentação', uni.roomBoard)}
                                                    {renderInfoItem('Custo Médio Pós-Auxílio', uni.averageCostAfterAid)}
                                                    {renderInfoItem('Pacote de Auxílio Médio', uni.averageNeedBasedAidPackage)}
                                                    {renderInfoItem('Política Financeira', uni.politicaFinanceira)}
                                                </div>
                                            )}

                                            {activeSection === 'application' && (
                                                <div className="grid md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg shadow-inner border border-slate-900">
                                                    {renderIconInfo(<FaPercent />, 'Taxa de Aceitação', uni.taxaAceitacao)}
                                                    {renderInfoItem('Taxa de Inscrição', uni.applicationFee)}
                                                    {renderMultiLineItem(null, 'Plataforma de Inscrição', uni.plataformaInscricao)}
                                                    {renderMultiLineItem(null, 'Modalidades de Aplicação', uni.tiposAplicacao)}
                                                    {renderInfoItem('Contato', uni.contato)}
                                                    
                                                    <div className="flex flex-col items-start gap-1 p-2 bg-slate-800 rounded-md col-span-1 md:col-span-1">
                                                        <span className="text-xs font-medium text-amber-500">Visitar Site</span>
                                                        <a href={uni.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-white font-semibold hover:underline">
                                                            <FaExternalLinkAlt className="w-3 h-3" /> Site Oficial
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20 px-4">
                            <img src={logo} alt="Nenhuma oportunidade encontrada" className="h-20 w-auto mb-6 opacity-70" />
                            <h2 className="text-2xl font-semibold text-white mb-2">Nenhuma universidade encontrada</h2>
                            <p className="text-sm text-white mb-6">Tente ajustar seus filtros para ver mais resultados.</p>
                            <button
                                onClick={onClearFilters}
                                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-full transition-colors duration-200"
                            >
                                Limpar Todos os Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {popup.visible && (
                <div className="fixed bottom-4 right-4 z-[999] bg-slate-900 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 animate-slideIn border border-slate-950">
                    <span>{popup.message}</span>
                    <button onClick={() => setPopup({ ...popup, visible: false })} className="text-white hover:text-gray-200">
                        ×
                    </button>
                </div>
            )}

            <ConfirmationPopup
                visible={confirmationPopup.visible}
                university={confirmationPopup.university}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
            />
        </div>
    );
};

export default CollegeList;