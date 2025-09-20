import { modalStore } from '../../stores/modal-store';

interface ModalCloseProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalClose({ children, className = '' }: ModalCloseProps) {
  const handleClose = () => {
    modalStore.closeModal();
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      className={className}
    >
      {children}
    </button>
  );
}