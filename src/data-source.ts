// src/data-source.ts

import { DataSource } from 'typeorm';

const entitiesPath = process.env.NODE_ENV === 'production'
    ? 'dist/entity/**/*.js'
    : 'src/entity/**/*.ts';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: ' ',
    database: 'myConnections',
    synchronize: true, // Disable in production
    logging: false,
    entities: [entitiesPath],
    migrations: ['src/migration/**/*.ts'],
    subscribers: [],
});
