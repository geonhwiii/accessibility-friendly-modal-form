import { useEffect, useId } from 'react';
import { useModalContext } from './modal-context';

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalTitle({ children, className = '' }: ModalTitleProps) {
  const { setTitleId } = useModalContext();
  const id = useId();

  useEffect(() => {
    setTitleId(id);
    return () => setTitleId('');
  }, [id, setTitleId]);

  return (
    <h2 id={id} className={`text-xl font-semibold ${className}`.trim()}>
      {children}
    </h2>
  );
}