import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import logo from "../assets/logo.png";

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const timeoutRef = useRef(null);

    const profileButtonClass = "flex items-center space-x-2 text-white hover:text-amber-500 transition-colors duration-300 py-2 px-3 rounded-md";
    const profileDropdownClass = "absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg py-2 border border-slate-950";

    const handleProfileMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsProfileMenuOpen(true);
    };

    const handleProfileMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsProfileMenuOpen(false);
        }, 300);
    };

    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    let headerBgClass = "bg-slate-950";
    if (location.pathname === "/") {
        headerBgClass = scrolled ? "bg-slate-900 shadow-md" : "bg-slate-900";
    }

    const getNavLinkClasses = (isActive) => {
        const activeClass = isActive ? 'text-amber-500' : 'text-white';
        return `block relative transition-colors duration-300 pb-1 ${activeClass}`;
    };

    return (
        <header className={`flex items-center justify-between text-lg sticky top-0 px-8 py-3.5 z-50 font-inter font-bold text-white transition-colors duration-500 ${headerBgClass}`}>
            
            <div className="flex items-center justify-between flex-1 md:hidden">
                <button onClick={toggleMobileMenu} className="text-white focus:outline-none z-10">
                    <FaBars size={24} />
                </button>
                <Link to='/' className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
                    <img className="h-10" src={logo} alt='Logo do Passaporte Global' />
                    <span className="text-xl text-white font-bold whitespace-nowrap text-lg sm:text-xl">Passaporte Global</span>
                </Link>
                
                <div className="w-6 h-6"></div>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-between">
                
                <Link to='/' className="flex items-center space-x-2">
                    <img className="h-10" src={logo} alt='Logo do Passaporte Global' />
                    <span className="text-xl text-white font-bold whitespace-nowrap">Passaporte Global</span>
                </Link>

                
                <nav className="flex-1 flex justify-center">
                    <ul className="flex items-center space-x-8">
                        <li className="group">
                            <NavLink
                                to='/'
                                end
                                className={({ isActive }) => getNavLinkClasses(isActive)}
                            >
                                Início
                                <span className={`absolute left-0 bottom-0 h-0.5 bg-amber-500 w-full transform transition-transform duration-300 ${location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </NavLink>
                        </li>
                        <li className="group">
                            <NavLink
                                to='/oportunidades'
                                className={({ isActive }) => getNavLinkClasses(isActive)}
                            >
                                Oportunidades
                                <span className={`absolute left-0 bottom-0 h-0.5 bg-amber-500 w-full transform transition-transform duration-300 ${location.pathname === '/oportunidades' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </NavLink>
                        </li>
                        <li className="group">
                            <NavLink
                                to='/mapa'
                                className={({ isActive }) => getNavLinkClasses(isActive)}
                            >
                                Mapa
                                <span className={`absolute left-0 bottom-0 h-0.5 bg-amber-500 w-full transform transition-transform duration-300 ${location.pathname === '/mapa' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </NavLink>
                        </li>
                        <li className="group">
                            <NavLink
                                to='/college-list'
                                className={({ isActive }) => getNavLinkClasses(isActive)}
                            >
                                College List
                                <span className={`absolute left-0 bottom-0 h-0.5 bg-amber-500 w-full transform transition-transform duration-300 ${location.pathname === '/college-list' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </NavLink>
                        </li>
                        <li className="group">
                            <NavLink
                                to='/dicionario'
                                className={({ isActive }) => getNavLinkClasses(isActive)}
                            >
                                Dicionário
                                <span className={`absolute left-0 bottom-0 h-0.5 bg-amber-500 w-full transform transition-transform duration-300 ${location.pathname === '/dicionario' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                
                <div
                    className="relative"
                    onMouseEnter={handleProfileMouseEnter}
                    onMouseLeave={handleProfileMouseLeave}
                >
                    <button className={profileButtonClass}>
                        <FaUserCircle size={24} />
                        <span>Perfil</span>
                    </button>

                    {isProfileMenuOpen && (
                        <div className={profileDropdownClass}>
                            <Link to='/perfil' onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300">
                                Meu Perfil
                            </Link>
                            <hr className="border-t border-slate-950 my-1" />
                            <Link to='/login' onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300">
                                Entrar
                            </Link>
                            <Link to='/cadastro' onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300">
                                Cadastrar
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            
            <div
                className={`fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleMobileMenu}
            ></div>
            <div className={`fixed top-0 left-0 w-64 h-full bg-slate-900 shadow-xl z-50 transform transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-amber-500">Navegação</h2>
                        <button onClick={toggleMobileMenu} className="text-white hover:text-amber-500">
                            <FaTimes size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 mt-4">
                        <ul className="space-y-4 text-white font-bold">
                            <li>
                                <NavLink
                                    to='/'
                                    end
                                    onClick={toggleMobileMenu}
                                    className={({ isActive }) => `block py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-800 ${isActive ? 'bg-slate-800 text-amber-500' : ''}`}
                                >
                                    Início
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/oportunidades'
                                    onClick={toggleMobileMenu}
                                    className={({ isActive }) => `block py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-800 ${isActive ? 'bg-slate-800 text-amber-500' : ''}`}
                                >
                                    Oportunidades
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/mapa'
                                    onClick={toggleMobileMenu}
                                    className={({ isActive }) => `block py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-800 ${isActive ? 'bg-slate-800 text-amber-500' : ''}`}
                                >
                                    Mapa
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/college-list'
                                    onClick={toggleMobileMenu}
                                    className={({ isActive }) => `block py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-800 ${isActive ? 'bg-slate-800 text-amber-500' : ''}`}
                                >
                                    College List
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/dicionario'
                                    onClick={toggleMobileMenu}
                                    className={({ isActive }) => `block py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-slate-800 ${isActive ? 'bg-slate-800 text-amber-500' : ''}`}
                                >
                                    Dicionário
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    <div className="mt-auto border-t border-slate-800 pt-4">
                        <h3 className="text-lg font-bold mb-2 text-amber-500">Minha Conta</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to='/perfil' onClick={toggleMobileMenu} className="block py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                                    Meu Perfil
                                </Link>
                            </li>
                            <li>
                                <Link to='/login' onClick={toggleMobileMenu} className="block py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                                    Entrar
                                </Link>
                            </li>
                            <li>
                                <Link to='/cadastro' onClick={toggleMobileMenu} className="block py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                                    Cadastrar
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;