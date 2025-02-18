import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/images', // 存储目录
      filename: (req, file, callback) => {
        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
        callback(new Error('只允许上传图片文件'), false);
      }
    },
  }))
  uploadFile(@UploadedFile() file) {
    return {
      filename: file.filename,
      url: `/images/${file.filename}`, // 返回可访问 URL
    };
  }
}
