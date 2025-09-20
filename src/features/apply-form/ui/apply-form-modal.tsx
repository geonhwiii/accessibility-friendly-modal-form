import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, FormInput, FormSelect } from '@/shared/ui';
import { modalStore } from '@/shared/stores/modal-store';
import { formSchema, type FormData } from '../model/schema';
import { INQUIRY_TYPES } from '@/shared/constants/options';

export function ApplyFormModal() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      inquiryType: '',
      message: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    modalStore.resolveModal(data);
  };

  const handleCancel = () => {
    form.reset();
    modalStore.closeModal();
  };

  return (
    <Modal>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">신청 폼</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="이름"
            placeholder="이름을 입력해주세요"
          />

          <FormInput
            control={form.control}
            name="email"
            type="email"
            label="이메일"
            placeholder="example@email.com"
          />

          <FormSelect
            control={form.control}
            name="inquiryType"
            label="문의 유형"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FormSelect>

          <FormInput
            control={form.control}
            name="message"
            label="메시지"
            placeholder="문의 내용을 입력해주세요"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              제출하기
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}