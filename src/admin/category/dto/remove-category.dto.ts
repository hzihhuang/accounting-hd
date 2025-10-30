import { Transform, Type } from 'class-transformer';
import { IsInt, IsPositive, IsArray, ArrayMinSize } from 'class-validator';

export class RemoveCategoryDto {
  @Type(() => Number) // 确保这个装饰器在最前面
  @IsInt({ message: 'ID必须是整数' })
  @IsPositive({ message: 'ID必须是正数' })
  id: number;
}

export class BatchRemoveCategoryDto {
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v)); // 手动转换每个元素
    }
    return value as number[];
  })
  @IsArray({ message: 'ID列表必须是数组' })
  @ArrayMinSize(1, { message: '至少选择一个标签删除' })
  @IsInt({ each: true, message: '每个ID都必须是整数' })
  @IsPositive({ each: true, message: '每个ID都必须是正数' })
  readonly ids: number[];
}
