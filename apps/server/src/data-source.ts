import { DataSource } from 'typeorm';
import { Task } from './entities/Task';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: ':memory:', // In-memory SQLite database
    synchronize: true, // Auto-sync schema (no migrations)
    logging: process.env.NODE_ENV === 'development',
    entities: [Task],
});
