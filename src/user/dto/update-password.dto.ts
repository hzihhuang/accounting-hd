import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: '旧密码不能为空' })
  @MinLength(6, { message: '旧密码至少 6 个字符' })
  @MaxLength(32, { message: '旧密码最多 32 个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,32}$/, {
    message: '旧密码必须包含字母和数字，且至少 6 个字符',
  })
  oldPassword: string; // 旧密码

  @IsString()
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '新密码至少 6 个字符' })
  @MaxLength(32, { message: '新密码最多 32 个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,32}$/, {
    message: '新密码必须包含字母和数字，且至少 6 个字符',
  })
  newPassword: string; // 新密码
}
