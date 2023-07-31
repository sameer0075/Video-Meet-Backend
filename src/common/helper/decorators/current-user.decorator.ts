import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwtDecode from 'jwt-decode';

function indexFind(value) {
  return value == 'Authorization';
}
export const LoggedInUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const index = request.res.req.rawHeaders.findIndex(indexFind);
    if (index !== -1) {
      const BearerToken = request.res.req.rawHeaders[index + 1];
      const token = BearerToken.split('Bearer')[1];
      const user = jwtDecode(token);
      return user;
    }
  },
);
