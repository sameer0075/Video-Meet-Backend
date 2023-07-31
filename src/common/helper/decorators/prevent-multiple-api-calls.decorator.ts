import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class PreventMultipleClicksInterceptor implements NestInterceptor {
  private ongoingRequests: Set<string> = new Set();

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const requestId = request.id; // Use a unique identifier for each request, e.g., request ID or user ID

    if (this.ongoingRequests.has(requestId)) {
      // Request is already in process, throw a ConflictException or customize as needed
      return throwError(
        () => new UnauthorizedException('Wait! Request is already in process'),
      );
    }

    this.ongoingRequests.add(requestId);

    return next.handle().pipe(
      tap(() => {
        // Remove the request from the ongoing requests set once the response is received
        this.ongoingRequests.delete(requestId);
      }),
      catchError((error) => {
        // Remove the request from the ongoing requests set in case of an error
        this.ongoingRequests.delete(requestId);
        return throwError(error);
      }),
    );
  }
}
