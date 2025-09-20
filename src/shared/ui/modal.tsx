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

  // ESC 키 처리
  useEffect(() => {
    if (!modalState.isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        modalStore.closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalState.isOpen]);

  // 배경 스크롤 방지
  useEffect(() => {
    if (!modalState.isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [modalState.isOpen]);

  // 포커스 관리 (기본)
  useEffect(() => {
    if (!modalState.isOpen) return;

    const modalElement = modalRef.current;
    if (modalElement) {
      // 모달 내 첫 번째 포커스 가능한 요소로 포커스 이동
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [modalState.isOpen]);

  // 배경 클릭 처리
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      modalStore.closeModal();
    }
  };

  if (!modalState.isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}