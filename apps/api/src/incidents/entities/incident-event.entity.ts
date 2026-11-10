import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    type Relation,
} from 'typeorm';
import { Incident } from './incident.entity.js';
import { IncidentEventType } from '../enums/incident-event-type.enum.js';

@Entity('incident_events')
export class IncidentEvent {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: IncidentEventType })
    eventType!: IncidentEventType

    @Column({ type: 'uuid', nullable: true })
    actorId: string | null;

    @Column({ type: 'jsonb', nullable: true })
    details: object | null

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @ManyToOne(() => Incident, (incident) => incident.events, {
        onDelete: 'RESTRICT',
        nullable: false
    })

    @JoinColumn({ name: 'incidentId' })
    incident!: Relation<Incident>
}