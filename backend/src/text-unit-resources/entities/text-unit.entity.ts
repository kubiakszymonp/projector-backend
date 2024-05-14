import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { TextUnitTag } from './text-unit-tag.entity';
import { AppBaseEntity } from 'src/common/base-entity';

@Entity()
export class TextUnit extends AppBaseEntity {
  @Column()
  content: string;

  @Column()
  organizationId: number | null;

  @Column()
  title: string;

  @JoinTable()
  @ManyToMany(() => TextUnitTag)
  tags: TextUnitTag[];
}
