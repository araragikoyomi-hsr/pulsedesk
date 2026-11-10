import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncidentEvents1794298950179 implements MigrationInterface {
    name = 'CreateIncidentEvents1794298950179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."incident_events_eventtype_enum" AS ENUM('CREATED', 'ACKNOWLEDGED', 'STATUS_CHANGED', 'ASSIGNED', 'NOTE_ADDED', 'RESOLVED', 'REOPENED', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "incident_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventType" "public"."incident_events_eventtype_enum" NOT NULL, "actorId" uuid, "details" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "incidentId" uuid NOT NULL, CONSTRAINT "PK_1230e0a50df3503eed115634297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "incident_events" ADD CONSTRAINT "FK_3aa9fb9ea475af8d1e4b571adfd" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident_events" DROP CONSTRAINT "FK_3aa9fb9ea475af8d1e4b571adfd"`);
        await queryRunner.query(`DROP TABLE "incident_events"`);
        await queryRunner.query(`DROP TYPE "public"."incident_events_eventtype_enum"`);
    }

}
