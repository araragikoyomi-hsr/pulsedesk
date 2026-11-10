import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity.js';
import { DataSource, Repository } from 'typeorm';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { isValidUUID } from '../config/utils.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';
import { IncidentEvent } from './entities/incident-event.entity.js';
import { IncidentEventType } from './enums/incident-event-type.enum.js';

@Injectable()
export class IncidentsService {
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepository: Repository<Incident>,
        private readonly dataSource: DataSource,
        @InjectRepository(IncidentEvent)
        private readonly incidentEventRepository: Repository<IncidentEvent>
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
        return this.dataSource.transaction(async (manager) => {
            const data = manager.getRepository(Incident).create({
                title: createIncidentDto.title,
                severity: createIncidentDto.severity,
                description: createIncidentDto.description
            })

            const savedIncident = await manager.getRepository(Incident).save(data)

            const eventData = manager.getRepository(IncidentEvent).create({
                eventType: IncidentEventType.CREATED,
                incident: { id: savedIncident.id },
            })

            await manager.getRepository(IncidentEvent).save(eventData)
            return savedIncident;
        })
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
