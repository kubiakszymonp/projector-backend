import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AppBaseEntity } from 'src/common/base-entity';

@Entity()
export class Organization extends AppBaseEntity {

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
