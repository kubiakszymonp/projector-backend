import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { TextUnit } from './text-unit.entity';
import { AppBaseEntity } from '../../common/base-entity';

@Entity()
export class TextUnitTag extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    nullable: true
  })
  organizationId?: string;

  @ManyToMany(() => TextUnit)
  textUnits: TextUnit[];
}
