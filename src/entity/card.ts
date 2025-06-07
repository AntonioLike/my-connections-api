import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    imagePath!: string;
}
