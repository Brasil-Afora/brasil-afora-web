import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const getTimeRemaining = (deadlineString) => {
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
    switch (tipoBolsa.toLowerCase()) {
        case 'parcial':
            return 'bg-amber-500 text-black';
        case 'completa':
            return 'bg-green-500 text-black';
        case 'variavel':
            return 'bg-blue-500 text-black';
        default:
            return 'bg-slate-900 text-white';
    }
};

const OpportunitiesList = ({ data }) => {
    const [visibleItems, setVisibleItems] = useState([]);

    useEffect(() => {
        setVisibleItems([]);
        const timers = data.map((_, index) => {
            return setTimeout(() => {
                setVisibleItems(prev => [...prev, index]);
            }, index * 30);
        });

        return () => timers.forEach(clearTimeout);
    }, [data]);

    if (data.length === 0) {
      return null;
    }

    return (
        <div className="p-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-inter">
                    {data.map((oportunidade, index) => {
                        const timeRemaining = getTimeRemaining(oportunidade.prazoInscricao);
                        const scholarshipClasses = getScholarshipTagClasses(oportunidade.tipoBolsa);

                        return (
                            <Link
                                key={oportunidade.id}
                                to={`/oportunidades/${oportunidade.id}`}
                                className={`
                                    bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col cursor-pointer border border-slate-950
                                    transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-amber-500/30
                                    ${visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                `}
                            >
                                <div className="absolute top-4 left-4 z-10 bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {oportunidade.tipo}
                                </div>

                                {timeRemaining && (
                                    <div className="absolute top-4 right-4 z-10 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                        {timeRemaining}
                                    </div>
                                )}

                                <div className="relative h-44">
                                    <img src={oportunidade.imagem} alt={`Capa de ${oportunidade.nome}`} className="w-full h-full object-cover" />
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="h-14 flex items-center mb-2">
                                        <h2 className="text-xl font-bold line-clamp-2 text-white">{oportunidade.nome}</h2>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        {oportunidade.nivelEnsino && (
                                            <span className="bg-slate-950 text-white px-2 py-1 rounded-full text-xs font-semibold">{oportunidade.nivelEnsino}</span>
                                        )}
                                        {oportunidade.tipoBolsa && (
                                            <span className={`${scholarshipClasses} px-2 py-1 rounded-full text-xs font-semibold`}>
                                                {oportunidade.tipoBolsa}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-grow justify-end text-white">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <FaMapMarkerAlt className="text-sm text-amber-500" />
                                            <span className="text-sm">{oportunidade.pais}</span>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-1">
                                            <FaCalendarAlt className="text-sm text-amber-500" />
                                            <span className="text-sm">Prazo: {oportunidade.prazoInscricao}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FaClock className="text-sm text-amber-500" />
                                            <span className="text-sm">Duração: {oportunidade.duracao}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OpportunitiesList;