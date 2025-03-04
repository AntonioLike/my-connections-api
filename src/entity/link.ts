import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['user1', 'user2']) // Ensures no duplicate links
export class Link {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_1_token", referencedColumnName: "userToken" })
    user1!: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_2_token", referencedColumnName: "userToken" })
    user2!: User;

    @Column({ type: "enum", enum: ["pending", "linked"], default: "pending" })
    status!: "pending" | "linked";
}
