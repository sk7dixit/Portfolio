import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-red-950/20 border border-red-500/25 flex items-center justify-center text-red-500 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 w-full pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 py-2.5 rounded-lg bg-background border border-border hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-1/2 py-2.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 text-xs font-extrabold tracking-wider transition-all cursor-pointer"
          >
            {loading ? 'WAIT...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
