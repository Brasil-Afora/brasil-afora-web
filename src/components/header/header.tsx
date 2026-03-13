import { useEffect, useRef, useState } from "react"
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { signOut, useSession } from "../../lib/auth-client"

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    closeProfileMenu()
    navigate("/login")
  }

  const profileButtonClass =
    "flex items-center space-x-2 text-white hover:text-amber-500 transition-colors duration-300 py-2 px-3 rounded-md"
  const profileDropdownClass =
    "absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg py-2 border border-slate-950"

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev)
  }

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  let headerBgClass = "bg-slate-950"
  if (location.pathname === "/") {
    headerBgClass = scrolled ? "bg-slate-900 shadow-md" : "bg-slate-900"
  }

  const getNavLinkClasses = (isActive: boolean) => {
    const activeClass = isActive ? "text-amber-500" : "text-white"
    return `block relative transition-colors duration-300 pb-1 ${activeClass}`
  }

  const navLinks = [
    { to: "/", label: "Início", end: true },
    { to: "/oportunidades", label: "Oportunidades", end: false },
    { to: "/mapa", label: "Mapa", end: false },
    { to: "/college-list", label: "College List", end: false },
    { to: "/dicionario", label: "Dicionário", end: false },
  ]

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-8 py-3.5 font-bold font-inter text-lg text-white transition-colors duration-500 ${headerBgClass}`}
    >
      <div className="flex flex-1 items-center justify-between md:hidden">
        <button
          className="z-10 text-white focus:outline-none"
          onClick={toggleMobileMenu}
          type="button"
        >
          <FaBars size={24} />
        </button>
        <Link
          className="absolute left-1/2 flex -translate-x-1/2 transform items-center space-x-2"
          to="/"
        >
          <img
            alt="Logo do Passaporte Global"
            className="h-10"
            height={40}
            src="/logo.png"
            width={40}
          />
          <span className="whitespace-nowrap font-bold text-lg text-white sm:text-xl">
            Passaporte Global
          </span>
        </Link>
        <div className="h-6 w-6" />
      </div>

      <div className="hidden flex-1 items-center justify-between md:flex">
        <Link className="flex items-center space-x-2" to="/">
          <img
            alt="Logo do Passaporte Global"
            className="h-10"
            height={40}
            src="/logo.png"
            width={40}
          />
          <span className="whitespace-nowrap font-bold text-white text-xl">
            Passaporte Global
          </span>
        </Link>

        <nav className="flex flex-1 justify-center">
          <ul className="flex items-center space-x-8">
            {navLinks.map(({ to, label, end }) => (
              <li className="group" key={to}>
                <NavLink
                  className={({ isActive }) => getNavLinkClasses(isActive)}
                  end={end}
                  to={to}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full transform bg-amber-500 transition-transform duration-300 ${location.pathname === to ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative" ref={profileRef}>
          <button
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            className={profileButtonClass}
            onClick={toggleProfileMenu}
            type="button"
          >
            {isAuthenticated && session.user.image ? (
              <img
                alt={session.user.name}
                className="h-7 w-7 rounded-full object-cover"
                height={28}
                src={session.user.image}
                width={28}
              />
            ) : (
              <FaUserCircle size={24} />
            )}
            <span className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {isAuthenticated ? session.user.name : "Perfil"}
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className={profileDropdownClass}>
              <Link
                className="block px-4 py-2 text-white transition-colors duration-300 hover:bg-slate-800"
                onClick={closeProfileMenu}
                to="/perfil"
              >
                Meu Perfil
              </Link>
              <hr className="my-1 border-slate-950 border-t" />
              {isAuthenticated ? (
                <>
                  <p className="truncate px-4 py-1 text-slate-400 text-xs">
                    {session.user.email}
                  </p>
                  <button
                    className="block w-full px-4 py-2 text-left text-red-400 transition-colors duration-300 hover:bg-slate-800"
                    onClick={handleSignOut}
                    type="button"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="block px-4 py-2 text-white transition-colors duration-300 hover:bg-slate-800"
                    onClick={closeProfileMenu}
                    to="/login"
                  >
                    Entrar
                  </Link>
                  <Link
                    className="block px-4 py-2 text-white transition-colors duration-300 hover:bg-slate-800"
                    onClick={closeProfileMenu}
                    to="/cadastro"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        aria-label="Fechar menu"
        className={`fixed inset-0 z-40 w-full bg-black bg-opacity-75 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={toggleMobileMenu}
        type="button"
      />
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-slate-900 shadow-xl transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-center justify-between border-slate-800 border-b pb-4">
            <h2 className="font-bold text-amber-500 text-xl">Navegação</h2>
            <button
              className="text-white hover:text-amber-500"
              onClick={toggleMobileMenu}
              type="button"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <nav className="mt-4 flex-1">
            <ul className="space-y-4 font-bold text-white">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 transition-colors duration-300 hover:bg-slate-800 ${isActive ? "bg-slate-800 text-amber-500" : ""}`
                    }
                    end={end}
                    onClick={toggleMobileMenu}
                    to={to}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto border-slate-800 border-t pt-4">
            <div className="mb-2 flex items-center gap-2">
              {isAuthenticated && session.user.image ? (
                <img
                  alt={session.user.name}
                  className="h-8 w-8 rounded-full object-cover"
                  height={32}
                  src={session.user.image}
                  width={32}
                />
              ) : (
                <FaUserCircle className="text-amber-500" size={20} />
              )}
              <h3 className="font-bold text-amber-500 text-lg">
                {isAuthenticated ? session.user.name : "Minha Conta"}
              </h3>
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  className="block rounded-lg px-4 py-2 transition-colors hover:bg-slate-800"
                  onClick={toggleMobileMenu}
                  to="/perfil"
                >
                  Meu Perfil
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <button
                    className="block w-full rounded-lg px-4 py-2 text-left text-red-400 transition-colors hover:bg-slate-800"
                    onClick={async () => {
                      toggleMobileMenu()
                      await signOut()
                      navigate("/login")
                    }}
                    type="button"
                  >
                    Sair
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      className="block rounded-lg px-4 py-2 transition-colors hover:bg-slate-800"
                      onClick={toggleMobileMenu}
                      to="/login"
                    >
                      Entrar
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block rounded-lg px-4 py-2 transition-colors hover:bg-slate-800"
                      onClick={toggleMobileMenu}
                      to="/cadastro"
                    >
                      Cadastrar
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
