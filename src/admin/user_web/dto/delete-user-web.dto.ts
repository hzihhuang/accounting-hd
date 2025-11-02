// remove-user.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class RemoveUserDto {
  @Type(() => Number) // 确保这个装饰器在最前面
  @IsInt({ message: 'ID必须是整数' })
  @IsPositive({ message: 'ID必须是正数' })
  id: number;
}
