import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { Repository } from 'typeorm';
import { IncidentSeverity } from './enums/incident-severity.enum.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';

@Injectable()
export class IncidentsService {
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepository: Repository<Incident>
    ) { }
    findAll() {
        return this.incidentRepository.find()
    }
    findOne(id: string) {
        return this.incidentRepository.findOneBy({ id })
    }
    async create(createIncidentDto: CreateIncidentDto) {
        const data = this.incidentRepository.create({
            title: createIncidentDto.title,
            severity: createIncidentDto.severity,
            description: createIncidentDto.description
        })
        return await this.incidentRepository.save(data)
    }
}
