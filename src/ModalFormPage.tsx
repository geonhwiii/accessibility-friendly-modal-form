import { Button } from '@/shared/ui';
import { openFormModal } from '@/shared/stores';
import { ApplyFormModal } from '@/features/apply-form';

export default function ModalFormPage() {
  const handleOpenModal = async () => {
    const result = await openFormModal();
    console.log('Modal result:', result);
  };

  return (
    <div className="flex items-center justify-center h-dvh">
      <Button onClick={handleOpenModal}>{'🚀 신청 폼 작성하기'}</Button>
      <ApplyFormModal />
    </div>
  );
}
