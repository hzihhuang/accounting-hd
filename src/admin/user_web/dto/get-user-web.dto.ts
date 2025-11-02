// src/admin/web-user/dto/get-users.dto.ts
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsIn,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsIn([0, 1])
  status?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  needSummary?: boolean;

  @IsOptional()
  @IsDateString({}, { message: '开始日期格式无效，正确格式: YYYY-MM-DD' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '结束日期格式无效，正确格式: YYYY-MM-DD' })
  endDate?: string;
}
