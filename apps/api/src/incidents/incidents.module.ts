import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { IncidentsService } from './incidents.service.js';
import { IncidentsController } from './incidents.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([Incident])],
    providers: [IncidentsService],
    controllers: [IncidentsController]
})
export class IncidentsModule {}
