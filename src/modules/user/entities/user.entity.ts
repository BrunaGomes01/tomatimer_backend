import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsEmail, IsNotEmpty, Min } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true, nullable: false, type: 'varchar', name: 'email' })
  email: string;

  @Min(8)
  @Exclude()
  @IsNotEmpty()
  @Column({ nullable: false, select: false, type: 'varchar', name: 'password' })
  password: string;

  @IsNotEmpty()
  @Column({ nullable: false, type: 'varchar', name: 'name' })
  name: string;

  @Column({ nullable: false, type: 'bool', name: 'isActive', default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
