import { IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTrendDto {
  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'year'])
  mode?: 'day' | 'week' | 'month' | 'year' = 'month';

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
