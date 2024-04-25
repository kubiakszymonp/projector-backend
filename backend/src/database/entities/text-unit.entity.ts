import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base-entity';
import { TextUnitTag } from './text-unit-tag.entity';

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

  // , (textUnitTag) => textUnitTag.textUnits)
  @JoinTable()
  @ManyToMany(() => TextUnitTag)
  tags: TextUnitTag[];
}
