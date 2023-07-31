import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  LoginRequestDto,
  ResendOtpRequestDto,
  UserRequestDto,
  UserUpdateDto,
  VerifyOtpRequestDto,
} from './dto/request.dto';
import { UserResponseDto } from './dto/response.dto';
import { Response } from 'express';
import PostgreStatusCode from 'src/enums/PostgresErrorCode';
import { Pagination } from 'src/common/helper/decorators/pagination.decorator';
import { LoggedInUser } from 'src/common/helper/decorators/current-user.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { AllowUnauthorizedRequest } from 'src/common/helper/decorators/allow-unauthorized-request.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseTags } from 'src/common/helper/decorators/api-response-tags.decorator';

@ApiTags('users')
@ApiBearerAuth('Authorization')
@ApiResponseTags()
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AllowUnauthorizedRequest()
  @Post()
  async create(
    @Res() response: Response,
    @Body() body: UserRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const data: UserResponseDto = await this.usersService.create(body);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Get('/logout')
  async logout(
    @Res() response: Response,
    @LoggedInUser() loggedInUser,
  ): Promise<string> {
    try {
      const data = await this.usersService.logout(loggedInUser);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @AllowUnauthorizedRequest()
  @Post('login')
  async login(
    @Res() response: Response,
    @Body() body: LoginRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const data: UserResponseDto = await this.usersService.login(body);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @AllowUnauthorizedRequest()
  @Post('verify-otp')
  async verifyOtp(
    @Res() response: Response,
    @Body() body: VerifyOtpRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const data: UserResponseDto = await this.usersService.VerifyOtp(body);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @AllowUnauthorizedRequest()
  @Post('resend-otp')
  async resendOtp(
    @Res() response: Response,
    @Body() body: ResendOtpRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const data: UserResponseDto = await this.usersService.resendOtp(body);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Get()
  async findAll(
    @Pagination() pagination: { page: number; limit: number; offset: number },
    @Res() response: Response,
    @LoggedInUser() user,
  ): Promise<UserResponseDto[]> {
    try {
      const data: UserResponseDto[] = await this.usersService.findAll(
        user,
        pagination,
      );
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Get(':id')
  async findOne(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    try {
      const data: UserResponseDto = await this.usersService.findOne(id);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Put(':id')
  async update(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UserUpdateDto,
  ): Promise<UserResponseDto> {
    try {
      const data: UserResponseDto = await this.usersService.update(id, body);
      response.status(PostgreStatusCode.SuccessCode).send(data);
      return data;
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }

  @Delete(':id')
  async remove(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.usersService.remove(id);
      response
        .status(PostgreStatusCode.SuccessCode)
        .send('User Deleted Successfully');
    } catch (err) {
      response
        .status(PostgreStatusCode.AuthorizationError)
        .send({ error: true, message: err });
    }
  }
}
