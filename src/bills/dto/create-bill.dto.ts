import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MaxLength,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateBillDto {
  @IsString()
  @IsNotEmpty({ message: '账单类型不能为空' })
  @IsIn(['income', 'expense'], {
    message: '账单类型只能是 income（收入）或 expense（支出）',
  })
  type: 'income' | 'expense';

  @IsNumber()
  @Min(0, { message: '金额不能小于 0' })
  amount: number; // 金额

  @IsString()
  @IsNotEmpty({ message: '分类不能为空' })
  @IsIn(['餐饮', '购物', '交通', '娱乐', '医疗', '住房', '其他'], {
    message: '分类不合法',
  })
  category: string; // 分类（如：餐饮、购物）

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: '备注最多 200 个字符' })
  note: string; // 备注（可选）
}
