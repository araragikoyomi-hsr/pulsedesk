import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IncidentsService } from './incidents.service.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Incident } from './entities/incident.entity.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }
    @Get()
    findAll() {
        return this.incidentsService.findAll();
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get an incident by Id' })
    @ApiParam({ name: 'id', description: 'Incident UUID' })
    @ApiOkResponse({ description: 'Incident Found', type: Incident })
    @ApiNotFoundResponse({ description: 'Incident Not Found' })
    async findOne(@Param('id') id: string) {
        return await this.incidentsService.findOne(id);
    }
    @Post()
    @ApiBody({ type: CreateIncidentDto })
    async createIncident(
        @Body()
        createIncidentDto: CreateIncidentDto
    ) {
        return await this.incidentsService.create(createIncidentDto)
    }
    @Patch(':id')
    async updateIncident(
        @Param('id') id: string,
        @Body() updateIncidentDto: UpdateIncidentDto
    ) {
        return await this.incidentsService.update(id, updateIncidentDto)
    }
}
