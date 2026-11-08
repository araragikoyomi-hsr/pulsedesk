import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { Repository } from 'typeorm';
import { IncidentSeverity } from './enums/incident-severity.enum.js';

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
    async create({
        title,
        severity,
        description
    }: {
        title: string;
        severity: IncidentSeverity;
        description?: string
    }) {
        const data = this.incidentRepository.create({
            title: title,
            severity: severity,
            description: description
        })
        return await this.incidentRepository.save(data)
    }
}
 