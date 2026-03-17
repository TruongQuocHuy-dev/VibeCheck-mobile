import { z } from 'zod';

/**
 * Domain Validation Schema for User Profile Setup.
 */
export const profileSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, 'Biệt danh phải có ít nhất 2 ký tự')
    .max(20, 'Biệt danh tối đa 20 ký tự'),
  birthYear: z
    .string()
    .length(4, 'Năm sinh phải gồm 4 chữ số')
    .regex(/^[0-9]+$/, 'Năm sinh chỉ được nhập số'),
  avatarUri: z.string().optional(),
});
