import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GuestUserToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const token = request.headers['token']?.replace('Bearer ', '');
    return token;
  },
);
