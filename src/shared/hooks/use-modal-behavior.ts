import { useEffect, useRef } from 'react';
import { modalStore } from '../stores/modal-store';

export function useModalBehavior(isOpen: boolean) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 키보드 이벤트 처리 (ESC 키 + 포커스 트랩)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const modalElement = contentRef.current;
      if (!modalElement) return;

      // ESC 키 처리
      if (event.key === 'Escape') {
        modalStore.closeModal();
        return;
      }

      // Tab 키 포커스 트랩
      if (event.key === 'Tab') {
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: 첫 번째 요소에서 마지막 요소로
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: 마지막 요소에서 첫 번째 요소로
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 배경 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // 배경 클릭 처리
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      modalStore.closeModal();
    }
  };

  return {
    overlayRef,
    contentRef,
    handleOverlayClick,
  };
}