import ReactDOM from "react-dom"

interface ProfileConfirmationPopupProps {
  name: string | null
  onCancel: () => void
  onConfirm: () => void
}

const ProfileConfirmationPopup = ({
  name,
  onConfirm,
  onCancel,
}: ProfileConfirmationPopupProps) => {
  if (!name) {
    return null
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-md rounded-lg border border-slate-950 bg-slate-900 p-8 text-center shadow-xl">
        <p className="mb-6 text-lg text-white">
          Tem certeza que deseja remover{" "}
          <span className="font-semibold text-amber-500">{name}</span> da sua
          lista?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
            onClick={onConfirm}
            type="button"
          >
            Confirmar
          </button>
          <button
            className="rounded-full bg-slate-950 px-6 py-2 font-semibold text-white transition-colors hover:bg-slate-800"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ProfileConfirmationPopup
