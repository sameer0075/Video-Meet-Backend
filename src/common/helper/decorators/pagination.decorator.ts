import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 10;
    if (limit != -1) {
      return {
        page,
        limit,
        offset: (page - 1) * limit,
      };
    } else {
      delete request.query.page;
      delete request.query.limit;
      return request.query;
    }
  },
);
