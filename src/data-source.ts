import { DataSource } from 'typeorm';
import { User } from './entity/user';
import { Link } from './entity/link';
import { Card } from './entity/card';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: ' ',
    database: 'myConnections',
    synchronize: true, // Disable in production
    logging: false,
    entities: [User, Link, Card], // Import entities directly instead of using a path
    migrations: ['src/migration/**/*.ts'],
    subscribers: [],
});
