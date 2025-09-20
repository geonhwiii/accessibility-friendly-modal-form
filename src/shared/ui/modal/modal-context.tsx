import { createContext, useContext } from 'react';

interface ModalContextValue {
  titleId?: string;
  descriptionId?: string;
  setTitleId: (id: string) => void;
  setDescriptionId: (id: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('[경고] Modal Provider 내부에서 호출해야 합니다!');
  }
  return context;
}

export { ModalContext };