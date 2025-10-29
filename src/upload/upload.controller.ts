import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync, renameSync } from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/temp', // 先存到临时目录
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              '仅支持上传 JPG、JPEG、PNG、GIF 和 WEBP 格式的图片',
            ),
            false,
          );
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file, @Req() req, @Body() body: any) {
    if (!file) {
      throw new BadRequestException('未检测到有效的图片文件');
    }

    // 现在可以拿到 body 参数了
    const folder = body.folder || 'images';
    const destination = `./uploads/${folder}`;

    // 确保目录存在
    if (!existsSync(destination)) {
      mkdirSync(destination, { recursive: true });
    }

    // 生成新文件名
    const originalName = file.originalname.replace(/\.[^/.]+$/, '');
    const cleanName = originalName.replace(/[^\w\u4e00-\u9fa5-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname).toLowerCase();
    const finalFilename = cleanName
      ? `${cleanName}_${uniqueSuffix}${ext}`
      : `${uniqueSuffix}${ext}`;

    // 移动文件到目标目录
    const oldPath = file.path;
    const newPath = `${destination}/${finalFilename}`;

    renameSync(oldPath, newPath);

    const host = req.protocol + '://' + req.get('host');

    return {
      filename: finalFilename,
      url: `${host}/uploads/${folder}/${finalFilename}`,
    };
  }
}
