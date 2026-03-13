import { useState } from "react"
import { Link } from "react-router-dom"
import { authClient } from "../../lib/auth-client"
import AuthLayout from "./auth-layout"
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "./auth-ui"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const { error: authError } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    setIsLoading(false)

    if (authError) {
      setError("Ocorreu um erro. Verifique o e-mail e tente novamente.")
      return
    }

    setSuccess(
      "Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha."
    )
  }

  return (
    <AuthLayout
      subtitle="Informe seu e-mail para receber as instruções de redefinição"
      title="Esqueceu sua senha?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthSuccess message={success} />

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

        <AuthButton isLoading={isLoading} type="submit">
          Enviar link de redefinição
        </AuthButton>

        <p className="text-center text-slate-400 text-sm">
          Lembrou a senha?{" "}
          <Link
            className="font-semibold text-amber-500 hover:text-amber-400"
            to="/login"
          >
            Voltar ao login
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
