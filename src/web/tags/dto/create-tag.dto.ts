import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsIn,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: '标签名称不能为空' })
  @IsString({ message: '标签名称必须是字符串' })
  @MaxLength(20, { message: '标签名称最多 20 个字符' })
  name: string;

  @IsNotEmpty({ message: '标签类型不能为空' })
  @IsIn(['income', 'expense'], { message: '标签类型必须是 income 或 expense' })
  type: 'income' | 'expense';

  @IsOptional()
  @IsString({ message: '图标必须是字符串' })
  @MaxLength(255, { message: '图标链接最多 255 个字符' })
  icon?: string;

  @IsOptional()
  @IsBoolean({ message: '是否私有必须是布尔值' })
  isPrivate?: boolean
}