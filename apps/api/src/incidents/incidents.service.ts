import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { Repository } from 'typeorm';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { isValidUUID } from '../config/utils.js';

@Injectable()
export class IncidentsService {
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepository: Repository<Incident>
    ) { }
    findAll() {
        return this.incidentRepository.find()
    }
    async findOne(id: string) {
        if (isValidUUID(id)) {
            const result = await this.incidentRepository.findOneBy({ id })
            if (result) {
                return result
            } else {
                throw new NotFoundException('Incident Not Found')
            }
        } else {
            console.log('id', id)
            throw new BadRequestException('Id not in correct format')
        }

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
