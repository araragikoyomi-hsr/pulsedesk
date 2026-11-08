import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncidents1794150635215 implements MigrationInterface {
    name = 'CreateIncidents1794150635215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."incidents_status_enum" AS ENUM('OPEN', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."incidents_severity_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`CREATE TABLE "incidents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "status" "public"."incidents_status_enum" NOT NULL DEFAULT 'OPEN', "severity" "public"."incidents_severity_enum" NOT NULL DEFAULT 'MEDIUM', "assigneeId" uuid, "serviceId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "resolvedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ccb34c01719889017e2246469f9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "incidents"`);
        await queryRunner.query(`DROP TYPE "public"."incidents_severity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."incidents_status_enum"`);
    }

}
