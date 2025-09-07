import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Background from '../assets/home.png';
import { FaGlobeAmericas, FaMapMarkerAlt, FaGraduationCap, FaBook, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import useScrollReveal from '../utils/useScrollReveal';

const Homepage = () => {
    const [statsRef, statsVisible] = useScrollReveal({ threshold: 0.2 });
    const [whyRef, whyVisible] = useScrollReveal({ threshold: 0.1 });
    const [contactRef, contactVisible] = useScrollReveal({ threshold: 0.1 });

    const [statsVisibleItems, setStatsVisibleItems] = useState([]);
    const [cardsVisibleItems, setCardsVisibleItems] = useState([]);
    const [contactVisibleItems, setContactVisibleItems] = useState([]);

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

    useEffect(() => {
        if (contactVisible) {
            setContactVisibleItems([]);
            const timers = [0, 1].map((_, index) => { // 0 for left side, 1 for right side form
                return setTimeout(() => {
                    setContactVisibleItems(prev => [...prev, index]);
                }, index * 200);
            });
            return () => timers.forEach(clearTimeout);
        }
    }, [contactVisible]);

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
        <div className="bg-slate-950 text-white font-inter min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <div
                className="relative min-h-screen"
                style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 py-16 text-center">
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
                            className="inline-block border-2 border-white text-white text-xl font-bold px-8 py-4 rounded-full hover:bg-white hover:text-slate-950 transition-all duration-300 transform hover:scale-105"
                        >
                            Explorar Mapa
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div ref={statsRef} className="bg-slate-900 py-16 px-4">
                <div className="container mx-auto">
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

            {/* Why Choose Section */}
            <div ref={whyRef} className="bg-slate-950 py-24 px-4">
                <div className="container mx-auto text-center">
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
                                    <div className="bg-slate-900 rounded-xl p-8 shadow-lg text-center h-full flex flex-col justify-between">
                                        <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-500 flex items-center justify-center mb-4 mx-auto">
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

            {/* Contact Section */}
            <div 
                ref={contactRef}
                className="bg-slate-900 py-24 px-4"
            >
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Contact Info */}
                    <div className={`text-center md:text-left ${baseTransition} ${contactVisibleItems.includes(0) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <h2 className="text-4xl font-extrabold text-white mb-4">Fale Conosco</h2>
                        <p className="text-lg text-white mb-8">
                            Tem alguma sugestão, crítica ou dúvida? Gostaríamos muito de ouvir você. Conecte-se conosco através dos nossos canais ou envie uma mensagem direta.
                        </p>
                        <ul className="space-y-4 text-white text-center md:text-left">
                            <li className="flex items-center justify-center md:justify-start text-lg">
                                <FaEnvelope className="text-amber-500 mr-3" size={24} />
                                <a href="mailto:contato@passaporteglobal.com" className="hover:text-amber-500 transition-colors">contato@passaporteglobal.com</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start text-lg">
                                <FaPhone className="text-amber-500 mr-3" size={24} />
                                <a href="tel:+5511999999999" className="hover:text-amber-500 transition-colors">+55 (11) 99999-9999</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start text-lg">
                                <FaInstagram className="text-amber-500 mr-3" size={24} />
                                <a href="https://instagram.com/passaporteglobal" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">@passaporteglobal</a>
                            </li>
                        </ul>
                    </div>
                    {/* Right Side: Contact Form */}
                    <div className={`bg-slate-950 p-8 rounded-xl shadow-lg ${baseTransition} ${contactVisibleItems.includes(1) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">Envie uma Mensagem</h3>
                        <form className="space-y-4">
                            <div>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 border-transparent text-sm" 
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 border-transparent text-sm" 
                                    placeholder="Seu e-mail"
                                />
                            </div>
                            <div>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows="3" 
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 border-transparent text-sm" 
                                    placeholder="Escreva sua mensagem aqui..."
                                ></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="inline-block w-full bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-full hover:bg-amber-600 transition-colors duration-300 transform hover:scale-105"
                                >
                                    Enviar Mensagem
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;