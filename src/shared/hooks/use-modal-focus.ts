import { useEffect } from 'react';

export function useModalFocus(
  isOpen: boolean,
  contentRef: React.RefObject<HTMLDivElement | null>,
  titleId?: string
) {
  // 포커스 관리 - 모달 제목으로 포커스 이동
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = contentRef.current;
    if (modalElement) {
      // 지정된 제목 ID가 있으면 해당 요소로, 없으면 첫 번째 포커스 가능한 요소로
      const titleElement = titleId
        ? modalElement.querySelector(`#${titleId}`) as HTMLElement
        : null;

      if (titleElement) {
        titleElement.setAttribute('tabindex', '-1');
        titleElement.focus();
      } else {
        // 제목이 없으면 첫 번째 포커스 가능한 요소로
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement?.focus();
      }
    }
  }, [isOpen, titleId]);
}