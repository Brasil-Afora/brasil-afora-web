import { useCallback, useEffect, useState } from "react"

interface ToastState {
  message: string
  visible: boolean
}

interface UseToastResult {
  hide: () => void
  show: (message: string) => void
  toast: ToastState
}

function useToast(autoHideMs = 3000): UseToastResult {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
  })

  const show = useCallback((message: string) => {
    setToast({ visible: true, message })
  }, [])

  const hide = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  useEffect(() => {
    if (toast.visible && autoHideMs > 0) {
      const timer = setTimeout(hide, autoHideMs)
      return () => clearTimeout(timer)
    }
  }, [toast.visible, autoHideMs, hide])

  return { toast, show, hide }
}

export default useToast
