import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1752455487287 implements MigrationInterface {
    name = 'InitSchema1752455487287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "stripeCustomerId" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_status_enum" AS ENUM('active', 'canceled', 'trialing')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "stripeSubscriptionId" character varying NOT NULL, "status" "public"."subscription_status_enum" NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE, "userId" integer, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
