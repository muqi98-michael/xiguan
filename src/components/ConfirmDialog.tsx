interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, confirmLabel = '确认', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className="relative z-10 w-80 rounded-2xl p-6 animate-fade-in"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
            }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
