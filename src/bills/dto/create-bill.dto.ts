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

  @IsNumber()
  @IsNotEmpty({ message: '标签Id不能为空' })
  tagId: number;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: '备注最多 200 个字符' })
  note: string; // 备注（可选）
}
