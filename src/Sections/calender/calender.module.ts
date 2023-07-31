import { Module } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { CalenderController } from './calender.controller';
import { Calender } from 'src/entities/calender.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Calender])],
  controllers: [CalenderController],
  providers: [CalenderService],
})
export class CalenderModule {}
