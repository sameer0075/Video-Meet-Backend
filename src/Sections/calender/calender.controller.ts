import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiResponseTags } from 'src/common/helper/decorators/api-response-tags.decorator';
import { LoggedInUser } from 'src/common/helper/decorators/current-user.decorator';
import PostgreStatusCode from 'src/enums/PostgresErrorCode';
import { AuthGuard } from 'src/guard/auth.guard';
import { CalenderService } from './calender.service';
import { CalenderRequestDto } from './dto/request.dto';
import { CalenderResponseDto } from './dto/response.dto';
import { DataSource } from 'typeorm';

@ApiTags('calender')
@ApiBearerAuth('Authorization')
@ApiResponseTags()
@Controller('calender')
@UseGuards(AuthGuard)
export class CalenderController {
  constructor(
    private readonly calenderService: CalenderService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(
    @Res() response: Response,
    @Body() createCalenderDto: CalenderRequestDto,
    @LoggedInUser() user,
  ): Promise<CalenderResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const data = await this.calenderService.createOrUpdate(
        createCalenderDto,
        user,
      );
      if (data) {
        await queryRunner.commitTransaction();
        response.status(PostgreStatusCode.SuccessCode).send(data);
        return data;
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Get()
  async findAll(
    @Res() response: Response,
    @LoggedInUser() user,
  ): Promise<CalenderResponseDto[]> {
    try {
      const data = await this.calenderService.findAll(user);
      if (data) {
        response.status(PostgreStatusCode.SuccessCode).send(data);
        return data;
      }
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Put('/cancel/:id')
  async remove(@Res() response: Response, @Param('id') id: number) {
    try {
      const data = await this.calenderService.remove(id);
      if (data) {
        response.status(PostgreStatusCode.SuccessCode).send(data);
        return 'Calender Notification Cancelled';
      }
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Put(':id')
  async update(
    @Res() response: Response,
    @Param('id') id: number,
    @Body() updateCalenderDto: CalenderRequestDto,
    @LoggedInUser() user,
  ): Promise<CalenderResponseDto> {
    try {
      const data = await this.calenderService.createOrUpdate(
        updateCalenderDto,
        user,
        id,
      );
      if (data) {
        response.status(PostgreStatusCode.SuccessCode).send(data);
        return data;
      }
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }
}
