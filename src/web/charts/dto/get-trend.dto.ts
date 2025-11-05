import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class GetTrendDto {
  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: '账单类型必须是 income 或 expense',
  })
  type?: 'income' | 'expense';

  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'year'])
  mode?: 'day' | 'week' | 'month' | 'year' = 'month';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
