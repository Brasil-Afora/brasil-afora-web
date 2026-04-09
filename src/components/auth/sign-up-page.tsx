import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signIn, signUp } from "../../lib/auth-client"
import AuthLayout from "./auth-layout"
import {
  AuthButton,
  AuthError,
  AuthInput,
  AuthSuccess,
  GoogleIcon,
} from "./auth-ui"

const SignUpPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      return
    }

    setIsLoading(true)

    const verificationWaitingUrl = `${window.location.origin}/verificar-email?email=${encodeURIComponent(email)}`

    const { error: authError } = await signUp.email({
      name,
      email,
      password,
      // After clicking the link in the inbox, send users to login instead of the verify page.
      callbackURL: `${window.location.origin}/login?email-verificado=1`,
    })

    setIsLoading(false)

    if (authError) {
      if (authError.code === "USER_ALREADY_EXISTS") {
        setError("Já existe uma conta com este e-mail.")
      } else {
        setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
      }
      return
    }

    setSuccess(
      "Conta criada! Verifique seu e-mail para confirmar seu cadastro."
    )
    setTimeout(() => navigate(verificationWaitingUrl), 2000)
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    setIsGoogleLoading(true)

    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/perfil`,
    })

    setIsGoogleLoading(false)
  }

  return (
    <AuthLayout
      subtitle="Crie sua conta gratuitamente"
      title="Comece sua jornada"
    >
      <div className="space-y-5">
        <AuthButton
          isLoading={isGoogleLoading}
          onClick={handleGoogleSignUp}
          type="button"
          variant="outline"
        >
          <span className="flex items-center justify-center gap-3">
            <GoogleIcon />
            Cadastrar com Google
          </span>
        </AuthButton>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-slate-500 text-sm">ou</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthError message={error} />
          <AuthSuccess message={success} />

          <AuthInput
            autoComplete="name"
            id="name"
            label="Nome completo"
            onChange={setName}
            placeholder="Seu nome"
            required
            type="text"
            value={name}
          />

          <AuthInput
            autoComplete="email"
            id="email"
            label="E-mail"
            onChange={setEmail}
            placeholder="seu@email.com"
            required
            type="email"
            value={email}
          />

          <AuthInput
            autoComplete="new-password"
            id="password"
            label="Senha"
            onChange={setPassword}
            placeholder="Mínimo 8 caracteres"
            required
            type="password"
            value={password}
          />

          <AuthInput
            autoComplete="new-password"
            id="confirm-password"
            label="Confirmar senha"
            onChange={setConfirmPassword}
            placeholder="Repita sua senha"
            required
            type="password"
            value={confirmPassword}
          />

          <AuthButton isLoading={isLoading} type="submit">
            Criar conta
          </AuthButton>
        </form>

        <p className="text-center text-slate-400 text-sm">
          Já tem uma conta?{" "}
          <Link
            className="font-semibold text-amber-500 hover:text-amber-400"
            to="/login"
          >
            Entrar
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUpPage
