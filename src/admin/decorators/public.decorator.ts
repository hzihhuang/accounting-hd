import { SetMetadata } from '@nestjs/common';

/**
 * 用于标记控制器方法，表示该方法不需要进行权限验证
 */
export const Public = () => SetMetadata('isPublic', true);
