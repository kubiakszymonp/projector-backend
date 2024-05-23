import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { TextUnitTag } from './text-unit-tag.entity';
import { AppBaseEntity } from '../../common/base-entity';
import { QueueTextUnit } from './queue-text-unit.entity';

@Entity()
export class TextUnit extends AppBaseEntity {
  @Column()
  content: string;

  @Column({
    nullable: true
  })
  description?: string;

  @Column({
    nullable: true
  })
  transposition?: number;

  @Column({
    nullable: true
  })
  organizationId?: number;

  @Column()
  title: string;

  @JoinTable()
  @ManyToMany(() => TextUnitTag)
  tags: TextUnitTag[];

  @OneToMany(() => QueueTextUnit, queueTextUnit => queueTextUnit.textUnit)
  queueTextUnits: QueueTextUnit[];

  @Column({
    nullable: true
  })
  partsOrder?: string;
}
