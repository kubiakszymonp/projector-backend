import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Organization } from './organization.entity';
import { AppBaseEntity } from '../../common/base-entity';

@Entity()
export class User extends AppBaseEntity {

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization | null;

  @Column({ nullable: true })
  organizationId: string | null;
}
