import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { BaseService } from 'src/common/services/base.service';
import { Calender } from 'src/entities/calender.entity';
import { Repository } from 'typeorm';
import { CalenderRequestDto } from './dto/request.dto';
import { CalenderResponseDto } from './dto/response.dto';
import { CronJob } from 'cron';
import DateEnums from 'src/enums/DateEnums';
import { eventContent } from 'src/common/templates/html-content';
import { emailService } from 'src/common/utils/email-service';
@Injectable()
export class CalenderService {
  private calenderRep: BaseService<Calender>;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Calender)
    private calenderRepository: Repository<Calender>,
    private mailService: MailerService,
  ) {
    this.calenderRep = new BaseService<Calender>(
      this.calenderRepository,
      Calender.name,
      this.cacheManager,
    );
  }

  async createOrUpdate(
    createCalenderDto: CalenderRequestDto,
    user,
    calender_id?: number,
  ): Promise<CalenderResponseDto> {
    const id = calender_id || null;
    const {
      custom_date,
      notification_alert_type,
      notification_alert_time,
      ...rest
    } = createCalenderDto;
    if (createCalenderDto.instant) {
      const payload = this.calenderRepository.create({
        ...rest,
        custom_date,
        notification_alert_type,
        notification_alert_time,
      });
      const data = id
        ? await this.calenderRep.update(id, payload)
        : await this.calenderRep.save(payload);

      const { title, description, instant, cancelled } = createCalenderDto;
      return new CalenderResponseDto(
        id || data.id,
        title,
        description,
        custom_date,
        instant,
        notification_alert_type,
        notification_alert_time,
        cancelled,
      );
    }
    const type =
      notification_alert_type === DateEnums.DAYS
        ? DateEnums.DAYS
        : notification_alert_type == DateEnums.MONTHS
        ? DateEnums.MONTHS
        : DateEnums.MINUTES;
    // const date = moment(custom_date).subtract(notification_alert_time, type);

    const date = new Date(custom_date);

    if (type === DateEnums.DAYS) {
      date.setDate(date.getDate() - notification_alert_time);
    } else if (type === DateEnums.MONTHS) {
      date.setMonth(date.getMonth() - notification_alert_time);
    } else {
      date.setMinutes(date.getMinutes() - notification_alert_time);
    }
    console.log('date', date);
    const payload = this.calenderRepository.create({
      ...rest,
      custom_date,
      notification_alert_type,
      notification_alert_time,
    });
    payload.user_id = user;
    const data = id
      ? await this.calenderRep.update(id, payload)
      : await this.calenderRep.save(payload);
    const reminderCronJobName = `reminder-${id || data.id}`;
    const reminderCronJob = new CronJob(
      date,
      () =>
        this.remindUser(
          id || data.id,
          reminderCronJob,
          reminderCronJobName,
          user,
        ),
      null,
      true,
    );
    reminderCronJob.name = reminderCronJobName;
    await reminderCronJob.start();
    await this.updateCronJob(id || data.id, {
      cron_job: reminderCronJobName,
    });

    const { title, description, instant, cancelled } = createCalenderDto;
    return new CalenderResponseDto(
      id || data.id,
      title,
      description,
      custom_date,
      instant,
      notification_alert_type,
      notification_alert_time,
      cancelled,
    );
  }

  async findAll(user): Promise<CalenderResponseDto[]> {
    const data: Calender[] = await this.calenderRep.findAll({
      user_id: user.id,
    });
    return data.map((info: Calender) => {
      const {
        id,
        title,
        description,
        custom_date,
        instant,
        notification_alert_time,
        notification_alert_type,
        cancelled,
      } = info;
      return new CalenderResponseDto(
        id,
        title,
        description,
        custom_date,
        instant,
        notification_alert_type,
        notification_alert_time,
        cancelled,
      );
    });
  }

  async findOne(user): Promise<CalenderResponseDto> {
    const data: Calender = await this.calenderRep.findOne({
      where: { user_id: user.id },
    });
    const {
      id,
      title,
      description,
      custom_date,
      instant,
      notification_alert_time,
      notification_alert_type,
      cancelled,
    } = data;
    return new CalenderResponseDto(
      id,
      title,
      description,
      custom_date,
      instant,
      notification_alert_type,
      notification_alert_time,
      cancelled,
    );
  }

  async remove(id: number) {
    return await this.calenderRep.update(id, { cancelled: true });
  }

  async remindUser(
    reminderId: number,
    reminderCronJob: CronJob,
    reminderCronJobName: string,
    user,
  ) {
    console.log(`Reminder ${reminderId} triggered!`);
    // Update the reminder record in the database
    const reminder = await this.findOne(reminderId);
    if (reminder) {
      await this.updateCronJob(reminderId, {
        cron_job: null,
      });
      const content = eventContent({
        mailService: this.mailService,
        email: user.email,
        name: user.name,
        title: reminder.title,
        description: reminder.description,
        reminder_date: reminder.custom_date,
      });
      emailService(this.mailService, user.email, content, 'Event Reminder ✔');
    }
    // Delete the cron job
    reminderCronJob.stop();
    console.log(`Cron job for reminder ${reminderId} deleted`);
  }

  async updateCronJob(id: number, data): Promise<void> {
    await this.calenderRep.update(id, data);
  }
}
