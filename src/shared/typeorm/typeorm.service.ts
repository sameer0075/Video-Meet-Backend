import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  /**
   * @description configurations related to DB ;
   * @returns TypeOrmModuleOptions ;
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    dotenv.config();
    console.log('config', process.env.DATABASE_NAME);
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      entities: ['dist/**/*.entity{.js,.ts}'],
      synchronize: false,
      migrations: ['src/database/migrations/*.{ts,js}'],
      migrationsTableName: 'migration',
    };
  }
}
