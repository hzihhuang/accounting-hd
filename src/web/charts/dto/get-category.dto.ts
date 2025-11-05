import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export class GetCategoryDto {
  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: '账单类型必须是 income 或 expense',
  })
  type?: 'income' | 'expense';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
