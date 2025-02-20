import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MaxLength,
  IsIn,
  IsOptional,
  IsDateString,
  Matches,
} from 'class-validator';

export class GetBillsDto {
  // 账单类型（默认值：'all'）
  @IsIn(['all', 'income', 'expense'])
  @IsOptional()
  @Transform(({ value }) => value ?? 'all') // 重点：未传时填充默认值
  type?: 'all' | 'income' | 'expense';

  // 标签 ID
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined)) // 允许数字字符串
  tagId?: number;

  @IsOptional()
  @Matches(/^\d{4}(-\d{2}(-\d{2})?)?$/, {
    message: '日期格式无效。使用YYYY、YYYY-MM或YYYY-MM-DD。',
  })
  @IsDateString()
  date?: string;

  // 开始日期
  @IsOptional()
  @IsDateString()
  startDate?: string;

  // 结束日期
  @IsOptional()
  @IsDateString()
  endDate?: string;

  // 第几页（默认 1）
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  })
  page: number = 1;

  // 每页条数（默认 0 代表全部）
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  })
  pageSize: number = 0;
}