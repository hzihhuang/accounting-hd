// upload.config.ts
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

// 允许的文件类型
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const videoMimeTypes = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
];

// 文件过滤器
export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: any,
) => {
  const allowedMimeTypes = [...imageMimeTypes, ...videoMimeTypes];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new HttpException(
        `不支持的文件类型: ${file.mimetype}. 仅支持图片和视频文件`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};

// 文件名生成器
export const generateFilename = (
  req: any,
  file: Express.Multer.File,
  callback: any,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

// Multer 配置
// upload.config.ts
export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `image-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    console.log('multerConfig 文件过滤器:', file.originalname);
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (imageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
};
