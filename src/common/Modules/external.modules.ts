import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/shared/typeorm/typeorm.service';
import { CacheModule } from '@nestjs/cache-manager';
export const ExternalModules = [
  ConfigModule.forRoot(),
  ScheduleModule.forRoot(),
  CacheModule.register({ isGlobal: true }),
  MulterModule.register({
    dest: './files',
  }),
  TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  ServeStaticModule.forRoot({
    rootPath: 'src/common/uploads',
  }),
  MailerModule.forRoot({
    transport: {
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    defaults: {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_MAIL}>`,
    },
  }),
];
