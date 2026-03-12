import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { authClient } from "../../lib/auth-client"
import AuthLayout from "./auth-layout"
import { AuthButton, AuthError, AuthSuccess } from "./auth-ui"

const subtitles: Record<string, string> = {
  verifying: "Aguarde enquanto verificamos seu e-mail...",
  success: "Sua conta foi confirmada",
  error: "Não foi possível verificar seu e-mail",
  pending: "Verifique sua caixa de entrada",
}

const getSubtitle = (status: string) =>
  subtitles[status] ?? "Verifique sua caixa de entrada"

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "pending"
  >(token ? "verifying" : "pending")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      return
    }

    authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      setStatus(error ? "error" : "success")
    })
  }, [token])

  const handleResend = async () => {
    setIsResending(true)
    setResendError(null)
    setResendSuccess(null)

    const session = await authClient.getSession()
    const userEmail = session.data?.user?.email

    if (!userEmail) {
      setResendError("Faça login para reenviar o e-mail de verificação.")
      setIsResending(false)
      return
    }

    const { error } = await authClient.sendVerificationEmail({
      email: userEmail,
      callbackURL: `${window.location.origin}/verificar-email`,
    })

    setIsResending(false)

    if (error) {
      setResendError("Não foi possível reenviar o e-mail. Tente novamente.")
    } else {
      setResendSuccess("E-mail de verificação reenviado com sucesso!")
    }
  }

  return (
    <AuthLayout subtitle={getSubtitle(status)} title="Verificação de e-mail">
      <div className="space-y-5">
        {status === "verifying" && (
          <div className="flex items-center justify-center py-8">
            <svg
              aria-hidden="true"
              className="h-10 w-10 animate-spin text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-green-400">
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-slate-300">
              E-mail verificado com sucesso! Você já pode acessar todos os
              recursos da plataforma.
            </p>
            <Link
              className="inline-block w-full rounded-lg bg-amber-500 px-4 py-2.5 text-center font-semibold text-slate-950 text-sm transition-colors hover:bg-amber-400"
              to="/perfil"
            >
              Ir para meu perfil
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <p className="text-center text-slate-300">
              O link de verificação é inválido ou expirou. Solicite um novo
              e-mail de verificação.
            </p>
            <AuthError message={resendError} />
            <AuthSuccess message={resendSuccess} />
            <AuthButton
              isLoading={isResending}
              onClick={handleResend}
              type="button"
            >
              Reenviar e-mail de verificação
            </AuthButton>
          </div>
        )}

        {status === "pending" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
              <p className="text-slate-300">
                Enviamos um e-mail de verificação para o endereço cadastrado.
                Clique no link do e-mail para confirmar sua conta.
              </p>
            </div>
            <AuthError message={resendError} />
            <AuthSuccess message={resendSuccess} />
            <AuthButton
              isLoading={isResending}
              onClick={handleResend}
              type="button"
              variant="outline"
            >
              Reenviar e-mail de verificação
            </AuthButton>
            <p className="text-center text-slate-400 text-sm">
              <Link
                className="font-semibold text-amber-500 hover:text-amber-400"
                to="/login"
              >
                Voltar ao login
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default VerifyEmailPage
