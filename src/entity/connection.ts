import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['user1', 'user2']) // Enforce uniqueness at DB level
export class Connection {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user1_token', referencedColumnName: 'userToken' })
    user1!: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user2_token', referencedColumnName: 'userToken' })
    user2!: User;

    @Column({ type: 'enum', enum: ['pending', 'linked'], default: 'pending' })
    status!: 'pending' | 'linked';
}
