import { Entity, ManyToOne, Column, Unique, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Card } from './card';
import { Connection } from './connection';

@Entity()
@Unique(['user', 'connection', 'card'])
export class UserCardResponse {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_token', referencedColumnName: 'userToken' })
    user!: User;

    @ManyToOne(() => Connection)
    @JoinColumn({ name: 'connection_id' })
    connection!: Connection;

    @ManyToOne(() => Card)
    @JoinColumn({ name: 'card_id' })
    card!: Card;

    @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
    response!: 'yes' | 'no' | null;
}
