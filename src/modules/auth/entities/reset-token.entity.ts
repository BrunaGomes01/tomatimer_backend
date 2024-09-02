import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';

@Entity({
  name: 'reset-token',
})
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ unique: true, nullable: false, type: 'varchar', name: 'token' })
  token: string;

  @IsNotEmpty()
  @Column({ nullable: false, name: 'userId' })
  userId: number;

  @IsNotEmpty()
  @Column({ nullable: false, name: 'expiryDate' })
  expiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
