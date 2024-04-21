import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base-entity';
import { DisplayState } from './display-state.entity';
import { ApiProperty } from '@nestjs/swagger';

export class QueueTextUnit {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}
export class TextUnitQueueContent {
  @ApiProperty()
  textUnits: QueueTextUnit[];
}

@Entity()
export class TextUnitQueue extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Organization, (organization) => organization.textUnitQueues)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  organizationId: number | null;

  @Column('simple-json')
  content: TextUnitQueueContent;

  @OneToOne(
    () => DisplayState,
    (projectorState) => projectorState.textUnitQueue,
  )
  projectorState: DisplayState;
}
