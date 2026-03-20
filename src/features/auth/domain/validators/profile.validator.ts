import { z } from 'zod';

/**
 * Domain Validation Schema for User Profile Setup.
 */
export const profileSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, 'Biệt danh phải có ít nhất 2 ký tự')
    .max(20, 'Biệt danh tối đa 20 ký tự')
    .regex(
      /^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/,
      'Biệt danh không được chứa ký tự đặc biệt'
    ),
  birthYear: z
    .string()
    .length(4, 'Năm sinh phải gồm 4 chữ số')
    .regex(/^[0-9]+$/, 'Năm sinh chỉ được nhập số')
    .refine((val) => {
      const year = parseInt(val, 10);
      const currentYear = new Date().getFullYear();
      return year >= 1950 && year <= currentYear - 16;
    }, 'Năm sinh không hợp lệ (Phải từ 1950 đến độ tuổi cho phép)'),
  avatarUri: z.string().optional(),
});
