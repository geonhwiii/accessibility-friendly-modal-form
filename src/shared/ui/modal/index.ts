import { ModalRoot } from './modal-root';
import { ModalContent } from './modal-content';
import { ModalTitle } from './modal-title';
import { ModalDescription } from './modal-description';
import { ModalClose } from './modal-close';

export const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
};

export * from './modal-context';