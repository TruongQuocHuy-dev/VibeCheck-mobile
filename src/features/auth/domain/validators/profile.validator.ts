import { z } from 'zod';

/**
 * Domain Validation Schema for User Profile Setup.
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên tối đa 50 ký tự')
    .regex(
      /^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/,
      'Họ tên không được chứa số hoặc ký tự đặc biệt'
    ),
  nickname: z
    .string()
    .trim()
    .refine((val) => val.length === 0 || val.length >= 2, 'Biệt danh phải có ít nhất 2 ký tự')
    .refine((val) => val.length <= 20, 'Biệt danh tối đa 20 ký tự')
    .refine(
      (val) =>
        val.length === 0 ||
        /^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/.test(val),
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
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính' }),
  }),
  avatarUri: z.string().optional(),
});
