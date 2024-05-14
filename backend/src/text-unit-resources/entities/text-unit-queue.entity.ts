import { Column, Entity, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppBaseEntity } from 'src/common/base-entity';
import { DisplayState } from 'src/projector-management/entities/display-state.entity';

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
export class TextUnitQueue extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  organizationId: number | null;

  @Column('simple-json')
  content: TextUnitQueueContent;
}
