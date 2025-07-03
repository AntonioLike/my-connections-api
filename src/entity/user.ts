import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

//TODO: remove id and use userToken

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    userToken!: string;
}
