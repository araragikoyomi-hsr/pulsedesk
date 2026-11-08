import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IncidentStatus } from "../enums/incident-status.enum.js";
import { IncidentSeverity } from "../enums/incident-severity.enum.js";

@Entity('incidents')
export class Incident {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ type: 'varchar', length: 255 })
    title: string;
    @Column({ type: 'text', nullable: true })
    description: string | null;
    @Column({ type: 'enum', default: IncidentStatus.OPEN })
    status: IncidentStatus;
    @Column({ type: 'enum', enum: IncidentSeverity, default: IncidentSeverity.MEDIUM })
    severity: IncidentSeverity;
    @Column({ type: 'uuid', nullable: true })
    assigneeId: string | null;
    @Column({ type: 'uuid', nullable: true })
    serviceId: string | null;
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
    @Column({ type: 'timestamptz', nullable: true })
    resolved_at: Date | null;
}