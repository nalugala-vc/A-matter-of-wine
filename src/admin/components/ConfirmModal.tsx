import './ConfirmModal.css'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button
            className="confirm-modal-btn confirm-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className={`confirm-modal-btn confirm-modal-confirm ${confirmVariant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
