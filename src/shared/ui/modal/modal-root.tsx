import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '@/shared/stores/modal-store';
import { useModalBehavior, useModalFocus } from '@/shared/hooks';
import { ModalContext } from './modal-context';

interface ModalRootProps {
  children: React.ReactNode;
}

export function ModalRoot({ children }: ModalRootProps) {
  const modalState = useModalStore();
  const [titleId, setTitleId] = useState<string>();
  const [descriptionId, setDescriptionId] = useState<string>();

  const { overlayRef, contentRef, handleOverlayClick } = useModalBehavior(modalState.isOpen);
  useModalFocus(modalState.isOpen, contentRef, titleId);

  if (!modalState.isOpen) return null;

  const contextValue = {
    titleId,
    descriptionId,
    setTitleId,
    setDescriptionId,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 modal-overlay-enter"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="모달"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div
          ref={contentRef}
          className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto modal-content-enter"
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
}