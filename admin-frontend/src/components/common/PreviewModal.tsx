import React from 'react';
import Modal from './Modal';
import { Eye, Download } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  title,
  url,
}: PreviewModalProps) {
  const isPdf = url.toLowerCase().endsWith('.pdf');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Resource Container */}
        <div className="w-full h-[55vh] bg-background border border-border rounded-xl overflow-hidden flex items-center justify-center relative">
          {isPdf ? (
            <iframe
              src={`${url}#toolbar=0`}
              title={title}
              className="w-full h-full border-none"
            />
          ) : (
            <img
              src={url}
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 w-full">
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD FILE</span>
          </a>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-background hover:bg-muted border border-border text-foreground text-xs font-bold rounded-lg transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
}
