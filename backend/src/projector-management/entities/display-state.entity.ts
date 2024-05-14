import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { DisplayType } from '../structures/display-type.enum';
import { TextUnitState as TextState } from '../structures/projector-state-text-state';
import { BaseEntity } from './base-entity';
import { TextUnitQueue } from './text-unit-queue.entity';
import { UploadedFile } from './uploaded-file.entity';

@Entity()
export class DisplayState extends BaseEntity {
  @Column()
  displayType: DisplayType;

  @Column('simple-json')
  textState: TextState;

  @Column()
  emptyDisplay: boolean;

  @OneToOne(() => Organization)
  @JoinColumn()
  organization: Organization;

  @OneToOne(() => TextUnitQueue)
  @JoinColumn()
  textUnitQueue: TextUnitQueue;

  @OneToOne(() => UploadedFile)
  @JoinColumn()
  uploadedFile?: UploadedFile | null;
}
