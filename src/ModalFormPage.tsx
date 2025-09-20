import { Button, Modal } from './ui';
import { openFormModal } from './stores/modal-store';

export default function ModalFormPage() {
  const handleOpenModal = async () => {
    const result = await openFormModal();
    console.log('Modal result:', result);
  };

  return (
    <div className="flex items-center justify-center h-dvh">
      <Button onClick={handleOpenModal}>{'🚀 신청 폼 작성하기'}</Button>

      <Modal>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">신청 폼</h2>
          <p className="text-gray-600 mb-4">
            간단한 테스트 모달입니다. ESC 키나 배경을 클릭하면 닫힙니다.
          </p>
          <Button onClick={() => console.log('Form submitted!')}>
            제출하기
          </Button>
        </div>
      </Modal>
    </div>
  );
}
