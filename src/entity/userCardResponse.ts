import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    Unique,
    JoinColumn,
} from 'typeorm';
import { User } from './user';
import { Card } from './card';
import { Link } from './link';

@Entity()
@Unique(['user', 'link', 'card']) // Prevents duplicate responses per user per card per link
export class UserCardResponse {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_token', referencedColumnName: 'userToken' })
    user!: User;

    @ManyToOne(() => Link)
    @JoinColumn({ name: 'link_id' })
    link!: Link;

    @ManyToOne(() => Card)
    @JoinColumn({ name: 'card_id' })
    card!: Card;

    @Column({ type: 'enum', enum: ['yes', 'no'] })
    response!: 'yes' | 'no';
}
