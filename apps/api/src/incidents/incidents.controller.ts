import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IncidentsService } from './incidents.service.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';

@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }
    @Get()
    findAll() {
        return this.incidentsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.incidentsService.findOne(id);
    }
    @Post()
    async createIncident(
        @Body()
        createIncidentDto: CreateIncidentDto
    ) {
        return this.incidentsService.create(createIncidentDto)
    }
}
