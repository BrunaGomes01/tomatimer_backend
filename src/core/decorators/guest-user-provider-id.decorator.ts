import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GuestUserProviderId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const token = request.headers['token']?.replace('Bearer ', '');

    if (!token) {
      throw new BadRequestException('Token jwt not found in request.');
    }

    const tokenDecoded = jwt.decode(token, { complete: true });
    return tokenDecoded.payload.sub;
  },
);
