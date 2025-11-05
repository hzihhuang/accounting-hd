import { IsOptional, IsEnum, IsDateString } from 'class-validator';

export class GetBillsDto {
  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: '账单类型必须是 income 或 expense',
  })
  type?: 'income' | 'expense';

  @IsOptional()
  @IsDateString({}, { message: '开始日期格式无效，正确格式: YYYY-MM-DD' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '结束日期格式无效，正确格式: YYYY-MM-DD' })
  endDate?: string;
}
