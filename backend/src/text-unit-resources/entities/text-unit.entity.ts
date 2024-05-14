import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { TextUnitTag } from './text-unit-tag.entity';
import { AppBaseEntity } from 'src/common/base-entity';
import { QueueTextUnit } from './queue-text-unit.entity';

@Entity()
export class TextUnit extends AppBaseEntity {
  @Column()
  content: string;

  @Column()
  description: string;

  @Column()
  transposition: number;

  @Column()
  organizationId: number | null;

  @Column()
  title: string;

  @JoinTable()
  @ManyToMany(() => TextUnitTag)
  tags: TextUnitTag[];

  @OneToMany(() => QueueTextUnit, queueTextUnit => queueTextUnit.textUnit)
  queueTextUnits: QueueTextUnit[];
}
