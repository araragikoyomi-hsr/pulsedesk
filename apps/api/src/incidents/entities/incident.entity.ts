import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    type Relation
} from 'typeorm';

import { IncidentStatus } from '../enums/incident-status.enum.js';
import { IncidentSeverity } from '../enums/incident-severity.enum.js';
import { IncidentEvent } from './incident-event.entity.js';

@Entity('incidents')
export class Incident {
    @ApiProperty({ example: 'aae43e99-812c-4872-b54d-79c97892b9b2' })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty({ example: 'Payment service timeout' })
    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @ApiProperty({
        example: 'Payment API is responding slowly',
        nullable: true
    })
    @Column({ type: 'text', nullable: true })
    description: string | null;

    @ApiProperty({ enum: IncidentStatus, example: IncidentStatus.OPEN })
    @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.OPEN })
    status!: IncidentStatus;

    @ApiProperty({ enum: IncidentSeverity, example: IncidentSeverity.HIGH })
    @Column({ type: 'enum', enum: IncidentSeverity, default: IncidentSeverity.MEDIUM })
    severity!: IncidentSeverity;

    @ApiProperty({ example: null, nullable: true })
    @Column({ type: 'uuid', nullable: true })
    assigneeId: string | null;

    @ApiProperty({ example: null, nullable: true })
    @Column({ type: 'uuid', nullable: true })
    serviceId: string | null;

    @ApiProperty({ example: '2026-11-08T15:13:38.263Z' })
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @ApiProperty({ example: '2026-11-08T15:13:38.263Z' })
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;

    @ApiProperty({ example: null, nullable: true })
    @Column({ type: 'timestamptz', nullable: true })
    resolvedAt: Date | null;

    @OneToMany(() => IncidentEvent, (incidentEvent) => incidentEvent.incident)
    events!: Relation<IncidentEvent[]>
}