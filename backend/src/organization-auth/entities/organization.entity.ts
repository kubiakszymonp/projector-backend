import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Organization extends BaseEntity {

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  paymentData: string;

  @Column()
  contactData: string;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
