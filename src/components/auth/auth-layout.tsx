import type { ReactNode } from "react"
import { Link } from "react-router-dom"

interface AuthLayoutProps {
  children: ReactNode
  subtitle: string
  title: string
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left panel — branding */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-slate-900 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 opacity-80" />
        <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-60 w-60 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center space-y-6 px-12 text-center">
          <Link className="flex items-center space-x-3" to="/">
            <img
              alt="Logo do Passaporte Global"
              className="h-16 w-16"
              height={64}
              src="/logo.png"
              width={64}
            />
            <span className="font-bold text-2xl text-white">
              Passaporte Global
            </span>
          </Link>

          <div className="mt-8 space-y-3">
            <h1 className="font-bold text-3xl text-white leading-tight">
              Sua jornada internacional começa aqui
            </h1>
            <p className="text-lg text-slate-400">
              Descubra oportunidades, universidades e tudo o que você precisa
              para estudar no exterior.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-bold text-2xl text-amber-500">500+</p>
              <p className="text-slate-400 text-sm">Universidades</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-2xl text-amber-500">100+</p>
              <p className="text-slate-400 text-sm">Oportunidades</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-2xl text-amber-500">50+</p>
              <p className="text-slate-400 text-sm">Países</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-2">
          {/* Mobile logo */}
          <Link className="mb-6 flex items-center space-x-2 lg:hidden" to="/">
            <img
              alt="Logo do Passaporte Global"
              className="h-8 w-8"
              height={32}
              src="/logo.png"
              width={32}
            />
            <span className="font-bold text-white">Passaporte Global</span>
          </Link>

          <h2 className="font-bold text-2xl text-white">{title}</h2>
          <p className="text-slate-400">{subtitle}</p>
        </div>

        <div className="mt-8 w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
