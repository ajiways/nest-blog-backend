import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from '../guards/interfaces/custom.request.interface';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: CustomRequest = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
