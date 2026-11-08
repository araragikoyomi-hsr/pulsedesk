import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Incident } from '../incidents/entities/incident.entity.js';
import { config } from 'dotenv';

config({ path: '../../.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
}

export default new DataSource({
    type: 'postgres',
    url: databaseUrl,
    entities: [Incident],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    synchronize: false,
});