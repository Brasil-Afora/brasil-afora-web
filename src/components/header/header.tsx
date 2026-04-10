import { useEffect, useRef, useState } from "react"
import {
  FaBars,
  FaEnvelope,
  FaGlobeAmericas,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserCircle,
} from "react-icons/fa"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOut, useSession } from "../../lib/auth-client"

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

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const firstName = getFirstName(session?.user.name)
  const profileDisplayName = firstName || "Perfil"
  const mobileAccountDisplayName = firstName || "Minha Conta"
  const isAdmin =
    ((session?.user as { role?: string } | undefined)?.role ?? "") === "admin"
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
    "group flex items-center gap-2.5 rounded-full bg-transparent px-2 py-2 text-slate-100 transition-all duration-300 hover:bg-[#1a315a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
  const profileDropdownClass =
    "absolute top-full right-0 mt-3 w-80 overflow-hidden rounded-3xl border border-[#2a4267] bg-gradient-to-b from-[#1a2f54] via-[#152748] to-[#111f38] p-3 shadow-[0_24px_50px_rgba(2,6,23,0.72)]"

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
                className="h-7 w-7 rounded-full object-cover"
                height={28}
                src={session.user.image}
                width={28}
              />
            ) : (
              <FaUserCircle size={24} />
            )}
            <span className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-base">
              {isAuthenticated ? profileDisplayName : "Perfil"}
            </span>
          </Button>

          {isProfileMenuOpen && (
            <div className={profileDropdownClass}>
              {isAuthenticated ? (
                <>
                  <div className="rounded-2xl border border-[#2f4974] bg-[#122441]/55 px-4 py-3">
                    <p className="font-semibold text-slate-100 text-sm">
                      Meu Perfil
                    </p>
                    <p className="mt-1 truncate text-slate-300 text-xs">
                      {session.user.name || profileDisplayName}
                    </p>
                    <p className="mt-1 flex items-center gap-2 truncate text-slate-400 text-xs">
                      <FaEnvelope className="shrink-0" size={11} />
                      {session.user.email}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1 rounded-2xl border border-[#2f4974]/70 bg-[#122441]/45 p-2">
                    <Link
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-100 text-sm transition-colors duration-200 hover:bg-[#20385f]"
                      onClick={closeProfileMenu}
                      to="/perfil"
                    >
                      <FaUser size={12} /> Meu Perfil
                    </Link>

                    {isAdmin && (
                      <Link
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-100 text-sm transition-colors duration-200 hover:bg-[#20385f]"
                        onClick={closeProfileMenu}
                        to="/admin"
                      >
                        <FaUser size={12} /> Painel Admin
                      </Link>
                    )}

                    <Separator className="my-1 bg-[#2f4974]" />

                    <Button
                      className="flex w-full items-center justify-start gap-2 rounded-xl px-3 py-2 text-left text-red-300 text-sm transition-colors duration-200 hover:bg-red-500/10 hover:text-red-200"
                      onClick={handleSignOut}
                      type="button"
                      variant="ghost"
                    >
                      <FaSignOutAlt size={12} /> Sair
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 p-1">
                  <div className="rounded-2xl border border-[#31507d] bg-[#152949]/70 px-4 py-4 text-center">
                    <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#08142b] text-amber-400 shadow-inner shadow-black/40">
                      <FaGlobeAmericas size={24} />
                    </span>
                    <p className="font-bold text-2xl text-amber-400">Mundo & Brasil</p>
                    <p className="mt-2 text-slate-300 text-sm">
                      Entre para salvar oportunidades e acompanhar seu progresso.
                    </p>
                  </div>

                  <Link
                    className="block rounded-xl border border-amber-300/30 bg-amber-400 px-3 py-2.5 text-center font-semibold text-slate-950 text-sm transition-colors duration-200 hover:bg-amber-300"
                    onClick={closeProfileMenu}
                    to="/login"
                  >
                    Entrar
                  </Link>
                  <Link
                    className="block rounded-xl border border-[#3a5f95]/80 bg-[#1a315a] px-3 py-2.5 text-center font-semibold text-slate-100 text-sm transition-colors duration-200 hover:bg-[#223e70]"
                    onClick={closeProfileMenu}
                    to="/cadastro"
                  >
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
