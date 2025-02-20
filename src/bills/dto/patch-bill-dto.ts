import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MaxLength,
  IsIn,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class PatchBillDto {
  @IsOptional()
  @IsIn(['income', 'expense'], {
    message: '账单类型只能是 income（收入）或 expense（支出）',
  })
  type: 'income' | 'expense';

  @IsNumber()
  @IsOptional()
  @Min(0, { message: '金额不能小于 0' })
  amount: number; // 金额

  @IsOptional()
  @IsNumber()
  tagId: number;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: '备注最多 200 个字符' })
  note: string; // 备注（可选）

  @IsOptional()
  @IsDateString({}, { message: '日期格式无效，正确格式: YYYY-MM-DD' })
  date: string;
}
