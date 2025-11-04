import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  id: number;
  username: string;
}

/**
 * @description: 获取用户信息
 */
export const User = createParamDecorator(
  <K extends keyof IUser>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): IUser[K] | IUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IUser;

    return data ? user?.[data] : user;
  },
);
