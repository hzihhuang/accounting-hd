import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteBillDto {
  @Type(() => Number)
  @IsInt({ message: 'id 必须是整数' })
  @IsPositive({ message: 'ID必须是正数' })
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}
