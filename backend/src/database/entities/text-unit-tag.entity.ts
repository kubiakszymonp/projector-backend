import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base-entity';
import { TextUnit } from './text-unit.entity';

@Entity()
export class TextUnitTag extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Organization, (organization) => organization.textUnitTags, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization | null;

  organizationId: number | null;

  //   @ManyToMany(() => TextUnit, (textUnit) => textUnit.tags)
  @ManyToMany(() => TextUnit)
  textUnits: TextUnit[];
}
