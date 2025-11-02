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
  IsNumber,
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
  type?: 'all' | 'income' | 'expense';

  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  @MaxLength(50, { message: '关键词最大长度为50个字符' })
  keyword?: string;

  @IsOptional()
  @IsString({ message: '标签id必须是字符串' })
  categoryIds?: string;

  @IsOptional()
  @IsDateString({}, { message: '开始日期格式无效，正确格式: YYYY-MM-DD' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '结束日期格式无效，正确格式: YYYY-MM-DD' })
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '最小金额必须是数字' })
  @Min(0, { message: '最小金额不能小于0' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '最大金额必须是数字' })
  @Min(0, { message: '最大金额不能小于0' })
  maxPrice?: number;

  @IsOptional()
  @IsEnum(['price', 'date'], {
    message: '排序字段必须是 price 或 date',
  })
  sortBy?: 'price' | 'date' = 'date';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message: '排序方向必须是 ASC 或 DESC',
  })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
