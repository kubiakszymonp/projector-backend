import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TextUnitState as TextState } from '../structures/projector-state-text-state';
import { UploadedFile } from './uploaded-file.entity';
import { AppBaseEntity } from '../../common/base-entity';
import { DisplayQueue } from 'src/text-unit-resources/entities/display-queue.entity';
import { DisplayType } from '../enums/display-type.enum';

@Entity()
export class DisplayState extends AppBaseEntity {
  @Column()
  displayType: DisplayType;

  @Column('simple-json')
  textState: TextState;

  @Column()
  emptyDisplay: boolean;

  @Column()
  organizationId: number | null;

  @Column()
  textUnitQueueId: number | null;

  @OneToOne(() => UploadedFile)
  @JoinColumn()
  uploadedFile?: UploadedFile | null;
}
