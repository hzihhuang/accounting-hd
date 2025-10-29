import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export class GetTagDto {
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
  @IsEnum(['all', 'income', 'expense'], {
    message: '类型必须是 all、income 或 expense 中的一个',
  })
  type?: 'all' | 'income' | 'expense';

  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  @MaxLength(50, { message: '关键词最大长度为50个字符' })
  keyword?: string;
}
