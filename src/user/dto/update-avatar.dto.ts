import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @IsNotEmpty({ message: '头像不能为空' })
  newAvatar: string; // 新密码
}
