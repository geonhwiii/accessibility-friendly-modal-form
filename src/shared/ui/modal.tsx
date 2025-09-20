import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore, modalStore } from '../stores/modal-store';

interface ModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: ModalProps) {
  const modalState = useModalStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalState.isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const modalElement = modalRef.current;
      if (!modalElement) return;

      if (event.key === 'Escape') {
        modalStore.closeModal();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalState.isOpen]);

  useEffect(() => {
    if (!modalState.isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [modalState.isOpen]);

  useEffect(() => {
    if (!modalState.isOpen) return;

    const modalElement = modalRef.current;
    if (modalElement) {
      const titleElement = modalElement.querySelector('#modal-title') as HTMLElement;
      if (titleElement) {
        titleElement.setAttribute('tabindex', '-1');
        titleElement.focus();
      } else {
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement?.focus();
      }
    }
  }, [modalState.isOpen]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      modalStore.closeModal();
    }
  };

  if (!modalState.isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 modal-overlay-enter"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="모달"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto modal-content-enter"
        onClick={(e) => e.stopPropagation()}
        role="document"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}