import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  MaxLength,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateBillDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({ message: '用户Id不能为空' })
  userId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({ message: '标签Id不能为空' })
  categoryId: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: '金额不能小于 0' })
  price: number; // 金额

  @IsOptional()
  @IsDateString({}, { message: '日期格式无效，正确格式: YYYY-MM-DD' })
  date: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: '备注最多 200 个字符' })
  remark: string; // 备注（可选）
}
