import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from "../assets/logo.png";

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const timeoutRef = useRef(null);
    
    const profileButtonClass = "flex items-center space-x-2 text-white hover:text-amber-500 transition-colors duration-300 py-2 px-3 rounded-md";
    const profileDropdownClass = "absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg py-2 border border-slate-950";

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsMenuOpen(false);
        }, 300);
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
        headerBgClass = scrolled ? "bg-slate-900 shadow-md" : "bg-transparent";
    }

    const getNavLinkClasses = (isActive) => {
        const activeClass = isActive ? 'text-amber-500' : 'text-white';
        return `block relative transition-colors duration-300 pb-1 ${activeClass}`;
    };

    return (
        <header className={`flex items-center justify-between text-lg sticky top-0 px-8 py-3.5 z-50 font-inter font-bold ${headerBgClass} text-white transition-colors duration-500`}>
            <div className="flex items-center gap-4">
                <Link to='/' className="flex items-center space-x-2">
                    <img className="h-10" src={logo} alt='Logo do Passaporte Global' />
                    <span className="text-xl text-white font-bold">Passaporte Global</span>
                </Link>
            </div>

            <nav className="hidden md:block">
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
                className="relative hidden md:block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button className={profileButtonClass}>
                    <FaUserCircle size={24} />
                    <span>Perfil</span>
                </button>

                {isMenuOpen && (
                    <div className={profileDropdownClass}>
                        <Link to='/perfil' onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300">
                            Meu Perfil
                        </Link>
                        <hr className="border-t border-slate-950 my-1" />
                        <Link to='/login' onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300">
                            Entrar
                        </Link>
                        <Link to='/cadastro' onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300">
                            Cadastrar
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;