import type { ChangeEvent, ReactNode } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface AuthInputProps {
  autoComplete?: string
  errorMessage?: string
  id: string
  label: string
  onChange?: (value: string) => void
  placeholder?: string
  registration?: UseFormRegisterReturn
  required?: boolean
  rightElement?: ReactNode
  type: string
  value?: string
}

export const AuthInput = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  registration,
  errorMessage,
  rightElement,
}: AuthInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    registration?.onChange(event)
    onChange?.(event.target.value)
  }

  return (
    <Field className="gap-1">
      <FieldLabel
        className="block font-medium text-slate-300 text-sm"
        htmlFor={id}
      >
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          {...(value !== undefined ? { value } : {})}
          aria-invalid={errorMessage ? true : undefined}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          id={id}
          name={registration?.name}
          onBlur={registration?.onBlur}
          onChange={handleChange}
          placeholder={placeholder}
          ref={registration?.ref}
          required={required}
          type={type}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      <FieldError className="text-red-400">{errorMessage}</FieldError>
    </Field>
  )
}

interface AuthButtonProps {
  children: ReactNode
  className?: string
  isLoading?: boolean
  onClick?: () => void
  type?: "submit" | "button"
  variant?: "primary" | "outline"
}

export const AuthButton = ({
  children,
  isLoading,
  type = "submit",
  onClick,
  variant = "primary",
  className = "",
}: AuthButtonProps) => {
  const base =
    "w-full rounded-lg px-4 py-2.5 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
  const variants = {
    primary: "bg-amber-500 text-slate-950 hover:bg-amber-400",
    outline:
      "border border-slate-700 bg-slate-800 text-white hover:border-slate-500 hover:bg-slate-700",
  }

  return (
    <Button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={isLoading}
      onClick={onClick}
      type={type}
      variant="ghost"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
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
          Aguarde...
        </span>
      ) : (
        children
      )}
    </Button>
  )
}

interface AuthErrorProps {
  message: string | null
}

export const AuthError = ({ message }: AuthErrorProps) => {
  if (!message) {
    return null
  }
  return (
    <p className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-2.5 text-red-400 text-sm">
      {message}
    </p>
  )
}

interface AuthSuccessProps {
  message: string | null
}

export const AuthSuccess = ({ message }: AuthSuccessProps) => {
  if (!message) {
    return null
  }
  return (
    <p className="rounded-lg border border-green-800 bg-green-900/30 px-4 py-2.5 text-green-400 text-sm">
      {message}
    </p>
  )
}

export const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)
