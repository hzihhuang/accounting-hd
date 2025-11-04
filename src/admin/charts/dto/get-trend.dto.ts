import { IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTrendDto {
  @IsOptional()
  @IsEnum(['day', 'month', 'year'])
  mode?: 'day' | 'month' | 'year' = 'day';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}
