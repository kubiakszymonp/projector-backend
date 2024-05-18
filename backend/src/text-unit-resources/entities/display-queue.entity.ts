import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppBaseEntity } from '../../common/base-entity';
import { DisplayState } from 'src/projector-management/entities/display-state.entity';
import { QueueTextUnit } from './queue-text-unit.entity';


@Entity()
export class DisplayQueue extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    nullable: true
  })
  organizationId?: number;

  @OneToMany(() => QueueTextUnit, queueTextUnit => queueTextUnit.displayQueue)
  queueTextUnits: QueueTextUnit[];
}
