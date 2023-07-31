import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1687025468934 implements MigrationInterface {
  name = 'CreateUserTable1687025468934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "is_super_user" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "otp" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `INSERT INTO "users" ("name", "email", "phone", "password", "is_super_user", "is_active", "otp", "created_at", "updated_at") VALUES ('admin', 'admin@gmail.com', '03065496448', '$2a$10$V1TwDJ567jD9O3SMY/.z1uUhlnRbAUhSQkfenMg4xkLcZowCAzbHa', true, true, null, NOW(), NOW())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" = 'admin@gmail.com'`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
