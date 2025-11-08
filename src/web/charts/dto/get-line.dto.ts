import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class GetLineDto {
  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: '账单类型必须是 income 或 expense',
  })
  type?: 'income' | 'expense';

  @IsOptional()
  @IsEnum(['day', 'month', 'year'])
  mode?: 'day' | 'month' | 'year' = 'month';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
