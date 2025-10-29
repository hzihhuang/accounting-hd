import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须是字符串' })
  @MaxLength(8, { message: '名称最多 8 个字符' })
  name: string;

  @IsNotEmpty({ message: '类型不能为空' })
  @IsIn(['income', 'expense'], { message: '类型必须是 income 或 expense' })
  type: 'income' | 'expense';

  @IsNotEmpty({ message: '图标不能为空' })
  @IsString({ message: '图标必须是字符串' })
  @MaxLength(255, { message: '图标链接最多 255 个字符' })
  img: string;

  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  @MaxLength(50, { message: '备注最多 50 个字符' })
  remark?: string;
}
