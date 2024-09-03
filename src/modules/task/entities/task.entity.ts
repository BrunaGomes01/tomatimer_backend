import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsNotEmpty, IsString } from 'class-validator';

@Entity({
  name: 'task',
})
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false, type: 'varchar', name: 'userId' })
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'varchar', name: 'name' })
  name: string;

  @Column({ nullable: false, type: 'bool', name: 'isActive', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
