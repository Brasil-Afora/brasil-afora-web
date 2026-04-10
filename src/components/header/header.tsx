import { useCallback, useEffect, useRef, useState } from "react"
import {
  FaBars,
  FaEnvelope,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserCircle,
} from "react-icons/fa"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getSession, signOut } from "../../lib/auth-client"

const FIRST_NAME_SPLIT_REGEX = /\s+/

const getHeaderBackgroundClass = (
  pathname: string,
  scrolled: boolean
): string => {
  if (pathname !== "/") {
    return "bg-slate-950"
  }

  return scrolled ? "bg-slate-900 shadow-md" : "bg-slate-900"
}

const getFirstName = (name?: string | null): string => {
  return name?.trim().split(FIRST_NAME_SPLIT_REGEX)[0] ?? ""
}

type HeaderSession = Awaited<ReturnType<typeof getSession>>["data"]

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState<HeaderSession>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(false)
  const isAuthenticated = !!session?.user
  const firstName = getFirstName(session?.user?.name)
  const profileDisplayName = firstName || "Perfil"
  const mobileAccountDisplayName = firstName || "Minha Conta"
  const isAdmin =
    ((session?.user as { role?: string } | undefined)?.role ?? "") === "admin"
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const shouldPrefetchSession =
    location.pathname.startsWith("/perfil") || location.pathname.startsWith("/admin")

  const loadSession = useCallback(async () => {
    if (isSessionLoading) {
      return
    }

    setIsSessionLoading(true)
    try {
      const response = await getSession()
      setSession(response.data ?? null)
    } finally {
      setIsSessionLoading(false)
    }
  }, [isSessionLoading])

  const handleSignOut = async () => {
    await signOut()
    setSession(null)
    closeProfileMenu()
    navigate("/login")
  }

  const profileButtonClass =
    "group flex items-center gap-2.5 rounded-full bg-transparent px-3 py-2.5 text-lg text-slate-100 transition-all duration-300 hover:bg-[#1a315a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
  const profileDropdownClass =
    `absolute top-full right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-[0_20px_45px_rgba(2,6,23,0.65)] ${isAuthenticated ? "w-80" : "w-56"}`

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => {
      const isOpening = !prev
      if (isOpening) {
        void loadSession()
      }
      return isOpening
    })
  }

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => {
      const isOpening = !prev
      if (isOpening) {
        void loadSession()
      }
      return isOpening
    })
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

  useEffect(() => {
    if (!shouldPrefetchSession) {
      return
    }

    void loadSession()
  }, [loadSession, shouldPrefetchSession])

  const headerBgClass = getHeaderBackgroundClass(location.pathname, scrolled)

  const getNavLinkClasses = (isActive: boolean) => {
    const activeClass = isActive ? "text-amber-500" : "text-white"
    return `block relative transition-colors duration-300 pb-1 ${activeClass}`
  }

  const navLinks = [
    { to: "/", label: "Início", end: true },
    { to: "/oportunidades/internacionais", label: "Internacional", end: false },
    { to: "/oportunidades/nacionais", label: "Nacional", end: false },
    { to: "/mapa", label: "Mapa", end: false },
    ...(isAdmin ? [{ to: "/admin", label: "Admin", end: false }] : []),
  ]

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-8 py-3.5 font-bold font-inter text-lg text-white transition-colors duration-500 ${headerBgClass}`}
    >
      <div className="flex flex-1 items-center justify-between md:hidden">
        <Button
          className="z-10 text-white focus:outline-none"
          onClick={toggleMobileMenu}
          type="button"
          variant="ghost"
        >
          <FaBars size={24} />
        </Button>
        <Link
          className="absolute left-1/2 flex -translate-x-1/2 transform items-center space-x-1"
          to="/"
        >
          <span className="whitespace-nowrap font-bebas font-bold text-2xl text-white sm:text-3xl">
            BRASIL
          </span>
          <img
            alt="Logo do Brasil Afora"
            className="h-9 w-auto object-contain"
            height={32}
            src="/logo.png"
            width={32}
          />
          <span className="whitespace-nowrap font-bebas font-bold text-2xl text-amber-500 sm:text-3xl">
            AFORA
          </span>
        </Link>
        <div className="h-6 w-6" />
      </div>

      <div className="hidden flex-1 items-center justify-between md:flex">
        <Link className="flex items-center space-x-2" to="/">
          <img
            alt="Logo do Brasil Afora"
            className="h-12 w-auto object-contain"
            height={32}
            src="/logo.png"
            width={32}
          />
          <span className="whitespace-nowrap font-bebas font-bold text-white text-xl">
            BRASIL <span className="text-amber-500">AFORA</span>
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
          <Button
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            className={profileButtonClass}
            onClick={toggleProfileMenu}
            type="button"
            variant="ghost"
          >
            {isAuthenticated && session.user.image ? (
              <img
                alt={session.user.name}
                className="h-8 w-8 rounded-full object-cover"
                height={32}
                src={session.user.image}
                width={32}
              />
            ) : (
              <FaUserCircle size={28} />
            )}
            <span className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-lg">
              {isAuthenticated ? profileDisplayName : "Perfil"}
            </span>
          </Button>

          {isProfileMenuOpen && (
            <div className={profileDropdownClass}>
              {isAuthenticated ? (
                <>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        <img
                          alt={session.user.name}
                          className="h-10 w-10 rounded-full object-cover"
                          height={40}
                          src={session.user.image}
                          width={40}
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-amber-500">
                          <FaUserCircle size={24} />
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-amber-500 text-xs uppercase tracking-wide">
                          Minha Conta
                        </p>
                        <p className="truncate font-semibold text-slate-100 text-sm">
                          {session.user.name || profileDisplayName}
                        </p>
                        <p className="mt-1 flex items-center gap-2 truncate text-slate-400 text-xs">
                          <FaEnvelope className="shrink-0" size={11} />
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <Link
                      className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-100 text-sm transition-colors duration-200 hover:border-amber-500/40 hover:text-amber-500"
                      onClick={closeProfileMenu}
                      to="/perfil"
                    >
                      <FaUser className="text-amber-500" size={12} /> Meu Perfil
                    </Link>

                    {isAdmin && (
                      <Link
                        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-100 text-sm transition-colors duration-200 hover:border-amber-500/40 hover:text-amber-500"
                        onClick={closeProfileMenu}
                        to="/admin"
                      >
                        <FaUser className="text-amber-500" size={12} /> Painel Admin
                      </Link>
                    )}

                    <Separator className="my-1 bg-slate-800" />

                    <Button
                      className="flex w-full items-center justify-start gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-left text-slate-200 text-sm transition-colors duration-200 hover:border-amber-500/40 hover:text-amber-500"
                      onClick={handleSignOut}
                      type="button"
                      variant="ghost"
                    >
                      <FaSignOutAlt className="text-amber-500" size={12} /> Sair
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-center font-semibold text-base text-slate-100 transition-colors duration-200 hover:border-amber-500/40 hover:text-amber-500"
                    onClick={closeProfileMenu}
                    to="/login"
                  >
                    <FaUserCircle className="text-amber-500" size={14} />
                    Entrar
                  </Link>
                  <Link
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-center font-semibold text-base text-slate-100 transition-colors duration-200 hover:border-amber-500/40 hover:text-amber-500"
                    onClick={closeProfileMenu}
                    to="/cadastro"
                  >
                    <FaUser className="text-amber-500" size={12} />
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Button
        aria-label="Fechar menu"
        className={`fixed inset-0 z-40 h-auto w-full bg-black bg-opacity-75 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={toggleMobileMenu}
        type="button"
        variant="ghost"
      />
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-slate-900 shadow-xl transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-center justify-between border-slate-800 border-b pb-4">
            <h2 className="font-bold text-amber-500 text-xl">Navegação</h2>
            <Button
              className="text-white hover:text-amber-500"
              onClick={toggleMobileMenu}
              type="button"
              variant="ghost"
            >
              <FaTimes size={24} />
            </Button>
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
                {isAuthenticated ? mobileAccountDisplayName : "Minha Conta"}
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
              {isAdmin && (
                <li>
                  <Link
                    className="block rounded-lg px-4 py-2 transition-colors hover:bg-slate-800"
                    onClick={toggleMobileMenu}
                    to="/admin"
                  >
                    Painel Admin
                  </Link>
                </li>
              )}
              {isAuthenticated ? (
                <li>
                  <Button
                    className="block w-full rounded-lg px-4 py-2 text-left text-red-400 transition-colors hover:bg-slate-800"
                    onClick={async () => {
                      toggleMobileMenu()
                      await signOut()
                      setSession(null)
                      navigate("/login")
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Sair
                  </Button>
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
