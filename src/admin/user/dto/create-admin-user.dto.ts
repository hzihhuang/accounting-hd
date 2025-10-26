import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateAdminUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(4, { message: '用户名至少 4 个字符' })
  @MaxLength(20, { message: '用户名最多 20 个字符' })
  username: string; // 用户名

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少 6 个字符' })
  @MaxLength(32, { message: '密码最多 32 个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,32}$/, {
    message: '密码必须包含字母和数字，且至少 6 个字符',
  })
  password: string; // 密码
}
