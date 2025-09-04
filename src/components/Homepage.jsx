import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Background from '../assets/home.png';
import { FaGlobeAmericas, FaMapMarkerAlt, FaGraduationCap, FaBook } from 'react-icons/fa';
import useScrollReveal from '../utils/useScrollReveal';

const Homepage = () => {
    const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.2 });
    const [whyRef, whyVisible] = useScrollReveal({ threshold: 0.1 });
    const [ctaRef, ctaVisible] = useScrollReveal({ threshold: 0.1 });

    const [statsVisibleItems, setStatsVisibleItems] = useState([]);
    const [cardsVisibleItems, setCardsVisibleItems] = useState([]);

    useEffect(() => {
        if (statsVisible) {
            setStatsVisibleItems([]);
            const timers = [0, 1, 2, 3].map((_, index) => {
                return setTimeout(() => {
                    setStatsVisibleItems(prev => [...prev, index]);
                }, index * 100);
            });
            return () => timers.forEach(clearTimeout);
        }
    }, [statsVisible]);

    useEffect(() => {
        if (whyVisible) {
            setCardsVisibleItems([]);
            const timers = [0, 1, 2, 3].map((_, index) => {
                return setTimeout(() => {
                    setCardsVisibleItems(prev => [...prev, index]);
                }, index * 150);
            });
            return () => timers.forEach(clearTimeout);
        }
    }, [whyVisible]);

    const baseTransition = "transition-all duration-700 ease-in-out transform";

    const statsData = [
        { value: '15+', label: 'Países com oportunidades' },
        { value: '10M+', label: 'Em bolsas de estudos' },
        { value: '100+', label: 'Faculdades dos EUA' },
        { value: '99%', label: 'Das oportunidades disponíveis' },
    ];

    const cardData = [
        {
            to: "/oportunidades",
            icon: FaGlobeAmericas,
            title: "Oportunidades",
            description: "Explore e encontre programas de intercâmbio, estudo e voluntariado com bolsas de estudo em diversas partes do mundo."
        },
        {
            to: "/mapa",
            icon: FaMapMarkerAlt,
            title: "Mapa Interativo",
            description: "Visualize no mapa onde estão localizadas as oportunidades de intercâmbio, filtre por país e descubra seu próximo destino."
        },
        {
            to: "/college-list",
            icon: FaGraduationCap,
            title: "College List",
            description: "Crie e gerencie sua lista de faculdades, com detalhes e uma checklist de aplicação para cada uma."
        },
        {
            to: "/dicionario",
            icon: FaBook,
            title: "Dicionário",
            description: "Entenda os termos e siglas essenciais do universo do intercâmbio e da candidatura internacional."
        }
    ];

    return (
        <div className="bg-slate-950 text-white font-inter min-h-screen">
            <div
                className="relative min-h-screen overflow-x-hidden"
                style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 z-0 bg-black opacity-0"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
                        Sua Jornada para o Mundo <br /> Começa Aqui
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl text-white">
                        Descubra oportunidades incríveis de intercâmbio, estudo e voluntariado pelo mundo. Construa seu passaporte global e transforme seu futuro.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/oportunidades"
                            className="inline-block bg-amber-500 text-slate-950 text-xl font-bold px-8 py-4 rounded-full hover:bg-amber-600 transition-colors duration-300 transform hover:scale-105"
                        >
                            Ver Oportunidades →
                        </Link>
                        <Link
                            to="/mapa"
                            className="inline-block bg-slate-900 text-white text-xl font-bold px-8 py-4 rounded-full hover:bg-slate-800 transition-colors duration-300 transform hover:scale-105"
                        >
                            Explorar Mapa
                        </Link>
                    </div>
                </div>
            </div>

            <div ref={statsRef} className="bg-slate-900 py-16">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                        {statsData.map((stat, index) => (
                            <div 
                                key={index} 
                                className={`${baseTransition} ${statsVisibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            >
                                <h3 className="text-5xl font-extrabold text-amber-500 mb-2">{stat.value}</h3>
                                <p className="text-lg font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div ref={whyRef} className="bg-slate-950 py-24">
                <div className="container mx-auto px-8 text-center">
                    <h2 className={`text-4xl md:text-5xl font-extrabold text-white mb-2 ${baseTransition} ${whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Por Que Escolher o Passaporte Global?</h2>
                    <p className={`text-lg text-white mb-12 max-w-2xl mx-auto ${baseTransition} ${whyVisible ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-10'}`}>
                        Uma plataforma que une várias ferramentas para sua jornada internacional.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {cardData.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={index}
                                    to={card.to}
                                    className={`block transform hover:scale-105 transition-transform duration-300 ${baseTransition} ${cardsVisibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                >
                                    <div className="bg-slate-900 rounded-xl p-8 shadow-lg text-left h-full flex flex-col justify-between">
                                        <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-500 flex items-center justify-center mb-4">
                                            <Icon size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-amber-500 mb-2">{card.title}</h3>
                                            <p className="text-white">{card.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div 
                ref={ctaRef}
                className={`bg-slate-900 py-24 text-center ${baseTransition} ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <h2 className="text-4xl font-extrabold text-white mb-4">Pronto para Começar Sua Aventura?</h2>
                <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
                    Junte-se a milhares de estudantes que transformaram suas vidas por meio de experiências internacionais.
                </p>
                <Link
                    to="/oportunidades"
                    className="inline-block bg-amber-500 text-black text-xl font-bold px-8 py-4 rounded-full hover:bg-amber-600 transition-colors duration-300 transform hover:scale-105"
                >
                    Explorar Oportunidades →
                </Link>
            </div>
        </div>
    );
};

export default Homepage;