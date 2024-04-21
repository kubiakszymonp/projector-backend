import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base-entity';

@Entity()
export class TextUnit extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => Organization, (organization) => organization.textUnits, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization | null;

  organizationId: number | null;

  @Column()
  title: string;
}
