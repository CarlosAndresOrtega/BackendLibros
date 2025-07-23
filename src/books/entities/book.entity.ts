import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: string;

  @Column({ type: 'integer', default: 0 })
  rating: number;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  upc: string;

  @Column({ nullable: true })
  productType: string;

  @Column({ nullable: true })
  reviewCount: number;
}
