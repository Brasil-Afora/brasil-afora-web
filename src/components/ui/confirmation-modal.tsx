import ReactDOM from "react-dom"

interface ConfirmationModalProps {
  accentColor?: "amber" | "blue"
  cancelText?: string
  confirmText?: string
  isOpen: boolean
  message: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmationModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  accentColor = "amber",
}: ConfirmationModalProps) => {
  if (!isOpen) {
    return null
  }

  const accentClasses =
    accentColor === "blue"
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-amber-500 hover:bg-amber-600"

  const textColorClass = accentColor === "blue" ? "text-blue-400" : "text-amber-500"

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-md rounded-lg border border-slate-950 bg-slate-900 p-8 text-center shadow-xl">
        <p className="mb-6 text-lg text-white">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className={`rounded-full ${accentClasses} px-6 py-2 font-semibold text-black transition-colors`}
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
          <button
            className="rounded-full bg-slate-950 px-6 py-2 font-semibold text-white transition-colors hover:bg-slate-800"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmationModal
