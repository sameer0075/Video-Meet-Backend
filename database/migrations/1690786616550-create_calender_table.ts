import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCalenderTable1690786616550 implements MigrationInterface {
    name = 'CreateCalenderTable1690786616550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calender" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "instant" boolean NOT NULL DEFAULT false, "custom_date" TIMESTAMP, "notification_alert_type" character varying NOT NULL DEFAULT 'minutes', "notification_alert_time" integer NOT NULL DEFAULT '15', "cancelled" boolean NOT NULL DEFAULT false, "cron_job" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_76008aad509f580ed6f916b805d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calender" ADD CONSTRAINT "FK_e9258df533623203d42b4886369" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calender" DROP CONSTRAINT "FK_e9258df533623203d42b4886369"`);
        await queryRunner.query(`DROP TABLE "calender"`);
    }

}
