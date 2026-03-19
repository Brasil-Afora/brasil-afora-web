export function getTimeRemaining(deadlineString: string): string | null {
  if (typeof deadlineString !== "string" || deadlineString.length < 10) {
    return null
  }

  const parts = deadlineString.split("/")
  if (parts.length !== 3) {
    return null
  }

  const day = Number.parseInt(parts[0], 10)
  const month = Number.parseInt(parts[1], 10) - 1
  const year = Number.parseInt(parts[2], 10)

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null
  }

  const deadline = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const timeDiff = deadline.getTime() - today.getTime()
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysRemaining > 0) {
    return `Faltam ${daysRemaining} dias`
  }
  if (daysRemaining === 0) {
    return "Termina hoje"
  }
  return "Prazo encerrado"
}
