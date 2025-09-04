import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WorldMap from './WorldMap';
import { oportunidades } from '../utils/opportunitiesData';
import useSessionStorage from '../utils/useSessionStorage';
import { FaMapPin, FaClock, FaCalendarAlt, FaArrowRight, FaTimes } from 'react-icons/fa';

const getCodigoPais = (nomePais) => {
    const codigos = {
        "Estados Unidos": "US",
        "Canadá": "CA",
        "Reino Unido": "GB",
        "Alemanha": "DE",
        "França": "FR",
        "Espanha": "ES",
        "Itália": "IT",
        "Irlanda": "IE",
        "Austrália": "AU",
        "Nova Zelândia": "NZ",
        "Japão": "JP",
        "Coreia do Sul": "KR",
        "China": "CN",
        "Argentina": "AR",
        "Chile": "CL",
        "México": "MX",
        "Suíça": "CH",
        "Brasil": "BR",
        "Europa": "EU",
        "Dinamarca": "DK",
        "Suécia": "SE",
        "Países Baixos": "NL",
        "Áustria": "AT",
        "Tailândia": "TH",
        "Singapura": "SG",
        "Noruega": "NO",
        "Hong Kong": "HK",
        "Diversos": "BR"
    };
    return codigos[nomePais];
};

const agruparOportunidadesPorPais = (dados) => {
    const oportunidadesPorPais = {};
    dados.forEach(oportunidade => {
        const codigoPais = getCodigoPais(oportunidade.pais);
        if (codigoPais) {
            if (!oportunidadesPorPais[codigoPais]) {
                oportunidadesPorPais[codigoPais] = {
                    nome: oportunidade.pais,
                    codigo: codigoPais,
                    count: 0,
                    intercambios: []
                };
            }
            oportunidadesPorPais[codigoPais].count++;
            oportunidadesPorPais[codigoPais].intercambios.push({
                id: oportunidade.id,
                nome: oportunidade.nome,
                tipo: oportunidade.tipo,
                duracao: oportunidade.duracao,
                prazoInscricao: oportunidade.prazoInscricao, // Corrigido aqui para ser consistente
                link: `/oportunidades/${oportunidade.id}`
            });
        }
    });
    return Object.values(oportunidadesPorPais).sort((a, b) => a.nome.localeCompare(b.nome));
};

const WorldMapPage = () => {
    const [clickedCountryData, setClickedCountryData] = useSessionStorage('mapClickedCountry', null);
    const listaDePaisesComOportunidades = useMemo(() => agruparOportunidadesPorPais(oportunidades), [oportunidades]);
    const oportunidadesPorCodigo = useMemo(() => {
        const agrupado = {};
        oportunidades.forEach(op => {
            const codigo = getCodigoPais(op.pais);
            if (codigo) {
                if (!agrupado[codigo]) {
                    agrupado[codigo] = {
                        nome: op.pais,
                        intercambios: []
                    };
                }
                agrupado[codigo].intercambios.push(op);
            }
        });
        return agrupado;
    }, [oportunidades]);

    const [showMap, setShowMap] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setShowMap(true), 100);
        const timer2 = setTimeout(() => setShowSidebar(true), 300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const handleMarkerClick = (data) => {
        setClickedCountryData(data);
    };

    const handleCountryListClick = (pais) => {
        setClickedCountryData(pais);
    };

    const handleCloseSidebar = () => {
        setClickedCountryData(null);
    };

    const baseTransition = "transition-all duration-500 ease-in-out transform";

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-white font-inter overflow-hidden">
            <div className={`w-full md:w-3/4 h-1/2 md:h-full flex items-center justify-center ${baseTransition} ${showMap ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <WorldMap
                    exchangeData={oportunidadesPorCodigo}
                    onMarkerClick={handleMarkerClick}
                />
            </div>
            
            <div className={`w-full md:w-1/4 h-1/2 md:h-full flex flex-col bg-slate-900 shadow-lg relative border border-slate-950 ${baseTransition} ${showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                {clickedCountryData && (
                    <button
                        onClick={handleCloseSidebar}
                        className="absolute top-4 right-4 text-white hover:text-amber-500 transition-colors z-10"
                        title="Fechar detalhes do país"
                    >
                        <FaTimes size={20} />
                    </button>
                )}

                <div className="px-6 py-4">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 border-slate-950 text-amber-500">Oportunidades de Intercâmbio</h2>
                </div>

                <div id="map-sidebar-scroll" className="flex-grow overflow-y-auto px-6 py-4 pt-0">
                    {!clickedCountryData ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Como Usar o Mapa</h3>
                            <ol className="list-decimal pl-5 mb-4 text-sm text-white">
                                <li>Clique em um marcador de país no mapa para ver as oportunidades disponíveis.</li>
                                <li>Use a barra lateral para ver informações detalhadas sobre as oportunidades.</li>
                            </ol>
                            <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Países com Oportunidades</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {listaDePaisesComOportunidades.map(pais => (
                                    <button
                                        key={pais.codigo}
                                        className="bg-slate-950 hover:bg-slate-800 text-white rounded-md p-2 text-left border border-slate-900"
                                        onClick={() => handleCountryListClick(pais)}
                                    >
                                        <span className="font-semibold text-amber-500">{pais.nome}</span>
                                        <br />
                                        {pais.count} {pais.count === 1 ? 'oportunidade' : 'oportunidades'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center mb-2">
                                <FaMapPin className="text-amber-500 mr-2" />
                                <h3 className="text-xl font-semibold text-amber-500">{clickedCountryData.nome}</h3>
                            </div>
                            <p className="text-sm text-white mb-4">
                                {clickedCountryData.intercambios.length} {clickedCountryData.intercambios.length === 1 ? 'oportunidade' : 'oportunidades'} disponíveis
                            </p>
                            <ul className="space-y-4">
                                {clickedCountryData.intercambios.map(oportunidade => (
                                    <li key={oportunidade.id} className="bg-slate-950 rounded-md p-4 text-white shadow-md border border-slate-900">
                                        <h4 className="font-semibold text-lg mb-1">{oportunidade.nome}</h4>
                                        <div className="flex items-center text-sm text-white mb-1">
                                            <FaClock className="text-amber-500 mr-2" />
                                            Duração: {oportunidade.duracao}
                                        </div>
                                        <div className="flex items-center text-sm text-white mb-2">
                                            <FaCalendarAlt className="text-amber-500 mr-2" />
                                            Prazo: {oportunidade.prazoInscricao}
                                        </div>
                                        <div className="inline-block bg-slate-900 text-white rounded-full px-3 py-1 text-xs font-semibold mb-2">
                                            {oportunidade.tipo}
                                        </div>
                                        <div className="flex justify-end">
                                            <Link to={`/oportunidades/${oportunidade.id}`} className="text-amber-500 font-semibold flex items-center">
                                                Saiba Mais <FaArrowRight className="ml-2" />
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorldMapPage;