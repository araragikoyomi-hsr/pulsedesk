import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { IncidentsService } from './incidents.service.js';
import { IncidentsController } from './incidents.controller.js';
import { IncidentEvent } from './entities/incident-event.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Incident, IncidentEvent])],
    providers: [IncidentsService],
    controllers: [IncidentsController]
})
export class IncidentsModule {}
