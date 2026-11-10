import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Incident } from '../incidents/entities/incident.entity.js';
import { config } from 'dotenv';
import { IncidentEvent } from '../incidents/entities/incident-event.entity.js';

config({ path: '../../.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
}

export default new DataSource({
    type: 'postgres',
    url: databaseUrl,
    entities: [Incident, IncidentEvent],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    synchronize: false,
});