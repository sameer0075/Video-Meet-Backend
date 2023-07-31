import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import * as cache from 'memory-cache';
const activeSessions = new cache.Cache();

import {
  LoginRequestDto,
  ResendOtpRequestDto,
  UserRequestDto,
  UserUpdateDto,
  VerifyOtpRequestDto,
} from './dto/request.dto';
import { UserResponseDto } from './dto/response.dto';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { emailService } from 'src/common/utils/email-service';
import { emailContent } from 'src/common/templates/html-content';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId({ length: 6 });

@Injectable()
export class UsersService {
  private userRep: BaseService<User>;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailerService,
  ) {
    this.userRep = new BaseService<User>(
      this.userRepository,
      User.name,
      this.cacheManager,
    );
  }

  async create(body: UserRequestDto): Promise<UserResponseDto> {
    const userExist = await this.userRep.findOne({
      withDeleted: true,
      where: { email: body.email },
    });
    if (userExist) {
      throw 'User with this email already exists.';
    } else {
      const otp = uid();
      Object.assign(body, { otp, is_active: 0 });
      const content = emailContent(body);
      const payload = this.userRepository.create(body);
      const data: User = await this.userRep.save(payload);
      if (data) {
        emailService(this.mailService, body.email, content, 'Sign Up EMail ✔');
        const { id, name, email, phone, is_active } = data;
        return new UserResponseDto(id, name, email, phone, is_active);
      } else {
        throw 'User not created';
      }
    }
  }

  async login(body: LoginRequestDto): Promise<UserResponseDto> {
    const data: User = await this.userRep.findOne({
      select: [
        'id',
        'name',
        'email',
        'phone',
        'is_active',
        'is_super_user',
        'password',
      ],
      where: {
        email: body.email,
      },
    });
    if (data && data.is_active) {
      const { id, name, email, phone, is_active, is_super_user } = data;
      const authenticated = await bcrypt.compare(body.password, data.password);
      if (authenticated) {
        const user = {
          id,
          name,
          email,
          phone,
          is_active,
          is_super_user,
        };
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        });
        await this.userRep.update(data.id, { otp: null });
        return new UserResponseDto(
          id,
          name,
          email,
          phone,
          is_active,
          token,
          is_super_user,
        );
      } else {
        throw 'Invalid Credentials!';
      }
    } else {
      if (data && !data.is_active) {
        throw 'Your account isnt activated! Please activate your account';
      } else {
        throw 'Invalid Credentials! User not found.';
      }
    }
  }

  async logout(user): Promise<string> {
    activeSessions.del(user.id.toString());
    return 'User Logged out successfully';
  }

  async findAll(
    user,
    pagination: {
      page: number;
      limit: number;
      offset: number;
    },
  ): Promise<UserResponseDto[]> {
    const data: User[] = await this.userRep.findAll({
      select: ['id', 'name', 'email', 'phone', 'is_active'],
      skip: pagination.offset,
      take: pagination.limit,
    });
    return data.map((info: User) => {
      const { id, name, email, phone, is_active } = info;
      return new UserResponseDto(id, name, email, phone, is_active);
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const data: User = await this.userRep.findOne({
      select: ['id', 'name', 'email', 'phone', 'is_active'],
      where: { id },
    });
    if (data) {
      const { id, name, email, phone, is_active } = data;
      return new UserResponseDto(id, name, email, phone, is_active);
    } else {
      throw 'User not found';
    }
  }

  async VerifyOtp(body: VerifyOtpRequestDto): Promise<UserResponseDto> {
    const data: User = await this.userRep.findOne({
      select: ['id', 'name', 'email', 'phone', 'is_active', 'otp'],
      where: { email: body.email },
    });
    if (data) {
      if (data.otp === body.otp) {
        const { id, name, email, phone } = data;
        await this.userRep.update(id, { otp: null, is_active: true });
        return new UserResponseDto(id, name, email, phone, true);
      } else {
        throw 'Invalid otp code';
      }
    } else {
      throw 'User not found';
    }
  }

  async resendOtp(body: ResendOtpRequestDto): Promise<UserResponseDto> {
    const data: User = await this.userRep.findOne({
      select: ['id', 'name', 'email', 'phone', 'is_active', 'otp'],
      where: { email: body.email },
    });
    if (data) {
      data.otp = uid();
      await this.userRep.update(data.id, data);
      const content = emailContent(data);
      emailService(
        this.mailService,
        body.email,
        content,
        'OTP Verification EMail ✔',
      );
      return data;
    } else {
      throw 'User not found';
    }
  }

  async update(id: number, body: UserUpdateDto): Promise<UserResponseDto> {
    const userExist = await this.userRep.findOne({
      withDeleted: true,
      where: { email: body.email },
    });
    if (userExist?.id != id && userExist?.email == body.email) {
      throw 'User with this email already exists.';
    }
    await this.userRep.update(id, body);
    const data: User = await this.userRep.findOne({
      select: ['id', 'name', 'email', 'phone', 'is_active'],
      where: { id },
    });
    if (data) {
      const { id, name, email, phone, is_active } = data;
      return new UserResponseDto(id, name, email, phone, is_active);
    } else {
      throw 'User not updated';
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRep.softDelete(id);
  }
}
