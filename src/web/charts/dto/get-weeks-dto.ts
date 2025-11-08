import { IsEnum, IsOptional } from 'class-validator';

export class GetWeeksDto {
  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: '账单类型必须是 income 或 expense',
  })
  type?: 'income' | 'expense';
}
