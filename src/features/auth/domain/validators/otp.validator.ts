import { z } from 'zod';

/**
 * Domain Validation Schemas for Authentication.
 */
export const phoneSchema = z
  .string()
  .min(9, 'Số điện thoại quá ngắn')
  .max(11, 'Số điện thoại quá dài')
  .regex(/^[0-9]+$/, 'Chỉ cho phép nhập số');

export const otpSchema = z
  .string()
  .length(4, 'Mã OTP phải gồm 4 chữ số');

export const passwordSchema = z
  .string()
  .min(4, 'Mật khẩu phải có ít nhất 4 ký tự');
