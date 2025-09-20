import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, FormInput, FormSelect } from '@/shared/ui';
import { modalStore } from '@/shared/stores/modal-store';
import { applyFormSchema, type ApplyFormData } from '../model/schema';
import { EXPERIENCE_OPTIONS } from '@/shared/constants/options';

export function ApplyFormModal() {
  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      name: '',
      email: '',
      experience: '',
      githubUrl: '',
    },
  });

  const onSubmit = (data: ApplyFormData) => {
    form.reset();
    modalStore.resolveModal(data);
  };

  const handleCancel = () => {
    form.reset();
    modalStore.closeModal();
  };

  return (
    <Modal>
      <div className="p-6">
        <h2 id="modal-title" className="text-xl font-semibold mb-2">신청 폼</h2>
        <p className="text-gray-600 text-sm mb-6">
          {"이메일과 FE 경력 연차 등 간단한 정보를 입력해주세요."}
        </p>
        <p id="modal-description" className="sr-only">
          {"신청 폼을 작성해주세요. 이름, 이메일, FE 경력 연차, GitHub 링크를 입력하신 후 제출 버튼을 눌러주세요."}
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="이름 / 닉네임"
            placeholder="이름 또는 닉네임을 입력해주세요"
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
            name="experience"
            label="FE 경력 연차"
          >
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>

          <FormInput
            control={form.control}
            name="githubUrl"
            label="Github 링크 (선택)"
            placeholder="https://github.com/username"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              {"취소"}
            </Button>
            <Button type="submit" className="flex-1">
              {"제출하기"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}