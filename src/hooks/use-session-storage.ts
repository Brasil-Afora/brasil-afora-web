import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"

function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      const savedValue = item ? (JSON.parse(item) as T) : initialValue
      if (
        typeof savedValue === "object" &&
        savedValue !== null &&
        !Array.isArray(savedValue)
      ) {
        return { ...initialValue, ...(savedValue as object) } as T
      }
      return savedValue
    } catch (error) {
      console.log("Erro ao ler do sessionStorage:", error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log("Erro ao salvar no sessionStorage:", error)
    }
  }, [key, value])

  return [value, setValue]
}

export default useSessionStorage
