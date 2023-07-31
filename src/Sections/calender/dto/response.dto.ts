export class CalenderResponseDto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly custom_date: Date;
  readonly instant: boolean;
  readonly notification_alert_type: string;
  readonly notification_alert_time: number;
  readonly cancelled: boolean;
  constructor(
    id: number,
    title: string,
    description: string,
    custom_date: Date,
    instant: boolean,
    notification_alert_type,
    notification_alert_time,
    cancelled,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.custom_date = custom_date;
    this.instant = instant;
    this.notification_alert_type = notification_alert_type;
    this.notification_alert_time = notification_alert_time;
    this.cancelled = cancelled;
  }
}
