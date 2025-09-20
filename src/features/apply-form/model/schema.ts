import { z } from 'zod';
import { modalStore } from '@/shared/stores/modal-store';

export const applyFormSchema = z.object({
  name: z
    .string()
    .min(1, '이름 또는 닉네임을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다'),

  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),

  experience: z
    .string()
    .min(1, 'FE 경력 연차를 선택해주세요'),

  githubUrl: z
    .string()
    .optional()
    .refine(
      (url) => !url || url === '' || /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/.test(url),
      { message: '올바른 GitHub URL을 입력해주세요 (예: https://github.com/username)' }
    ),
});

export type ApplyFormData = z.infer<typeof applyFormSchema>;

export async function openFormModal(triggerElement?: HTMLElement): Promise<ApplyFormData | null> {
  return modalStore.openModal<ApplyFormData>('form-modal', triggerElement);
}