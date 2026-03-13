import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error("Erro ao ler do Local Storage:", error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Erro ao salvar no Local Storage:", error)
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
