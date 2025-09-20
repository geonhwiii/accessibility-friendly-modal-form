import { useEffect, useId } from 'react';
import { useModalContext } from './modal-context';

interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
  visuallyHidden?: boolean;
}

export function ModalDescription({
  children,
  className = '',
  visuallyHidden = false
}: ModalDescriptionProps) {
  const { setDescriptionId } = useModalContext();
  const id = useId();

  useEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId('');
  }, [id, setDescriptionId]);

  const hiddenClass = visuallyHidden ? 'sr-only' : '';

  return (
    <p id={id} className={`${className} ${hiddenClass}`.trim()}>
      {children}
    </p>
  );
}