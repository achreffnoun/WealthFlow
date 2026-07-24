import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirmer', message }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-body-md text-on-surface-variant mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="px-5 py-2.5 rounded-lg bg-error text-on-error font-bold hover:opacity-90 transition-opacity"
        >
          Supprimer
        </button>
      </div>
    </Modal>
  )
}
