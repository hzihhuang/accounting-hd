import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** 
 * @description: 获取用户信息
 */
export const GetUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);