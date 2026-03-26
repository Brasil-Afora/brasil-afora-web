interface ToastProps {
  message: string
  onClose: () => void
  visible: boolean
}

const Toast = ({ visible, message, onClose }: ToastProps) => {
  if (!visible) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex animate-slideIn items-center gap-4 rounded-lg border border-slate-950 bg-slate-900 p-4 text-white shadow-lg">
      <span>{message}</span>
      <button
        className="text-white hover:text-gray-200"
        onClick={onClose}
        type="button"
      >
        &times;
      </button>
    </div>
  )
}

export default Toast
