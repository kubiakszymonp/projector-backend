import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Organization } from './organization.entity';
import { AppBaseEntity } from 'src/common/base-entity';

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

  organizationId: number | null;
}
