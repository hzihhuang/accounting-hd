// remove-user.dto.ts
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
} from 'class-validator';

export class RemoveUserDto {
  @Type(() => Number) // 确保这个装饰器在最前面
  @IsInt({ message: 'ID必须是整数' })
  @IsPositive({ message: 'ID必须是正数' })
  id: number;
}

export class BatchRemoveUserDto {
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v)); // 手动转换每个元素
    }
    return value as number[];
  })
  @IsArray({ message: 'ID列表必须是数组' })
  @ArrayMinSize(1, { message: '至少选择一个用户删除' })
  @ArrayNotEmpty({ message: 'ids 数组不能为空' })
  @IsInt({ each: true, message: '每个ID都必须是整数' })
  @IsPositive({ each: true, message: '每个ID都必须是正数' })
  readonly ids: number[];
}
