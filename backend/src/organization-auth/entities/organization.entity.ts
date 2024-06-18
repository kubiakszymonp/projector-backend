import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AppBaseEntity } from '../../common/base-entity';

@Entity()
export class Organization extends AppBaseEntity {

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
