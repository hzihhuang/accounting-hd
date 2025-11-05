import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class GetBillsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数最小为1' })
  @Max(100, { message: '每页条数最大为100' })
  pageSize?: number = 10;

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
