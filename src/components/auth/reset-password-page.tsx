import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { authClient } from "../../lib/auth-client"
import AuthLayout from "./auth-layout"
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "./auth-ui"

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

    if (!token) {
      setError(
        "Link de redefinição inválido ou expirado. Solicite um novo link."
      )
      return
    }

    setIsLoading(true)

    const { error: authError } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    setIsLoading(false)

    if (authError) {
      setError(
        "Link expirado ou inválido. Solicite um novo link de redefinição."
      )
      return
    }

    setSuccess("Senha redefinida com sucesso!")
    setTimeout(() => navigate("/login"), 2000)
  }

  return (
    <AuthLayout
      subtitle="Escolha uma nova senha para sua conta"
      title="Redefinir senha"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthSuccess message={success} />

        <AuthInput
          autoComplete="new-password"
          id="password"
          label="Nova senha"
          onChange={setPassword}
          placeholder="Mínimo 8 caracteres"
          required
          type="password"
          value={password}
        />

        <AuthInput
          autoComplete="new-password"
          id="confirm-password"
          label="Confirmar nova senha"
          onChange={setConfirmPassword}
          placeholder="Repita a nova senha"
          required
          type="password"
          value={confirmPassword}
        />

        <AuthButton isLoading={isLoading} type="submit">
          Redefinir senha
        </AuthButton>

        <p className="text-center text-slate-400 text-sm">
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

export default ResetPasswordPage
