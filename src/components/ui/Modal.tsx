'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { playTone } from '@/lib/interaction/tone';

const EASE = [0.16, 1, 0.3, 1] as const;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}

/** Shared dialog shell: scroll lock, Escape, backdrop click, focus in and focus return. */
export default function Modal({ isOpen, onClose, label, children, className = '' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBody onClose={onClose} label={label} className={className}>
          {children}
        </ModalBody>
      )}
    </AnimatePresence>
  );
}

function ModalBody({ onClose, label, children, className }: Omit<ModalProps, 'isOpen'>) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const returnFocus = document.activeElement as HTMLElement | null;
    // Respect autoFocus on a child (e.g. the terminal input); otherwise focus the dialog itself.
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playTone('close');
        closeRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      returnFocus?.focus?.();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-bg/70 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playTone('close');
          onClose();
        }
      }}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-lenis-prevent
        className={`max-h-[92svh] w-full overflow-y-auto border border-line bg-surface text-fg shadow-2xl outline-none ${className}`}
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        playTone('close');
        onClick();
      }}
      aria-label={label}
      data-cursor="Close"
      className="grid size-9 place-items-center border border-line transition-colors hover:bg-fg hover:text-bg"
    >
      ✕
    </button>
  );
}
