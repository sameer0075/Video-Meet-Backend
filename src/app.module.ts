import { MiddlewareConsumer, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/helper/exception-filter';
import { ExternalModules } from './common/Modules/external.modules';
import { InternalModules } from './common/Modules/internal.modules';
import * as compression from 'compression';
import { PreventMultipleClicksInterceptor } from './common/helper/decorators/prevent-multiple-api-calls.decorator';

dotenv.config();
@Module({
  imports: [...ExternalModules, ...InternalModules],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PreventMultipleClicksInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(compression()).forRoutes('*');
  }
}
