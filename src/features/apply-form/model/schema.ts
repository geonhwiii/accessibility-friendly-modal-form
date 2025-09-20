import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다'),

  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
      message: '올바른 이메일 형식을 입력해주세요',
    }),

  inquiryType: z
    .string()
    .min(1, '문의 유형을 선택해주세요'),

  message: z
    .string()
    .min(1, '메시지를 입력해주세요')
    .min(10, '메시지는 최소 10글자 이상이어야 합니다'),
});

export type FormData = z.infer<typeof formSchema>;