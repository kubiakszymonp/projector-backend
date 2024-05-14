import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Organization } from './organization.entity';

@Entity()
export class User extends BaseEntity {

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
