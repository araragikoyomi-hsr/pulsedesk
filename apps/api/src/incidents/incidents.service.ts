import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { Repository } from 'typeorm';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { isValidUUID } from '../config/utils.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';

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
            console.log('bad id', id)
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

    async update(id: string, updateIncidentDto: UpdateIncidentDto) {
        if (isValidUUID(id)) {
            if (Object.keys(updateIncidentDto).length === 0) {
                throw new BadRequestException('At least one field is required');
            }
            const data = await this.incidentRepository.findOneBy({ id })
            if (data) {
                const savedData = this.incidentRepository.merge(data, updateIncidentDto)
                return this.incidentRepository.save(savedData)
            } else {
                throw new NotFoundException('Incident with given id not found')
            }
        } else {
            throw new BadRequestException('Invalid Uuid bro')
        }

    }
}
