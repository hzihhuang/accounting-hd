import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  ArrayNotEmpty,
  ArrayMinSize,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class DeleteBillDto {
  @Type(() => Number)
  @IsInt({ message: 'id 必须是整数' })
  @IsPositive({ message: 'ID必须是正数' })
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}

export class BatchDeleteBillDto {
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v)); // 手动转换每个元素
    }
    return value as number[];
  })
  @IsArray({ message: 'ID列表必须是数组' })
  @ArrayMinSize(1, { message: '至少选择一个账单删除' })
  @ArrayNotEmpty({ message: 'ids 数组不能为空' })
  @IsInt({ each: true, message: '每个ID都必须是整数' })
  @IsPositive({ each: true, message: '每个ID都必须是正数' })
  readonly ids: number[];
}
