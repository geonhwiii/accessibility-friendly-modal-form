import { Button } from '@/shared/ui';
import { openFormModal } from '@/features/apply-form/model/schema';
import { ApplyFormModal } from '@/features/apply-form';

export default function ModalFormPage() {
  const handleOpenModal = async () => {
    const result = await openFormModal();
    console.log('[Apply Form 제출 🚀]', result);
  };

  return (
    <div className="flex items-center justify-center h-dvh">
      <Button onClick={handleOpenModal}>{'🚀 신청 폼 작성하기'}</Button>
      <ApplyFormModal />
    </div>
  );
}
