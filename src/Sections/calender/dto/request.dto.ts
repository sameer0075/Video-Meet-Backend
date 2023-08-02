import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CalenderRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsBoolean()
  instant: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsString()
  custom_date: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsString()
  notification_alert_type: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsNumber()
  notification_alert_time: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsString()
  cron_job: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'This is a optional property',
  })
  @IsOptional()
  @IsBoolean()
  cancelled: boolean;
}
