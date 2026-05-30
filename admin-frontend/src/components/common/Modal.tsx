import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
}: ModalProps) {
  // ESC key press handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md w-full',
    md: 'max-w-xl w-full',
    lg: 'max-w-4xl w-full',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm cursor-default"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className={`${sizeClasses[size]} bg-card/95 border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 relative flex flex-col max-h-[85vh]`}
          >
            {/* Soft Ambient Light Ray */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            {/* Header section */}
            <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between shrink-0 select-none">
              <div>
                <h3 className="text-base font-bold text-foreground tracking-tight">{title}</h3>
                {description && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-sans leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
