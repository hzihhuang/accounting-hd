import {
  BadRequestException,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WebController } from '@/web/WebController';

@WebController('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images', // 存储目录
        filename: (req, file, callback) => {
          // 生成唯一文件名
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 限制文件大小 5MB
      },
      fileFilter: (req, file, callback) => {
        // 允许的文件类型
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
  uploadFile(@UploadedFile() file, @Req() req) {
    if (!file) {
      throw new BadRequestException('未检测到有效的图片文件');
    }
    const host = req.protocol + '://' + req.get('host');
    return {
      filename: file.filename,
      url: `${host}/images/${file.filename}`, // 返回可访问 URL
    };
  }
}
