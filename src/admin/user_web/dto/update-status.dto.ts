import { IsIn, IsInt } from 'class-validator';

export class UpdateUserStatusDto {
  @IsInt()
  @IsIn([0, 1])
  status: number;
}
