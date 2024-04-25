import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { DisplayState } from './display-state.entity';
import { TextUnitQueue } from './text-unit-queue.entity';
import { TextUnit } from './text-unit.entity';
import { OrganizationData } from '../structures/organization-data';
import { BaseEntity } from './base-entity';
import { UploadedFile } from './uploaded-file.entity';
import { TextUnitTag } from './text-unit-tag.entity';

@Entity()
export class Organization extends BaseEntity {
  @OneToOne(() => DisplayState, (projectorState) => projectorState.organization)
  projectorState: DisplayState;

  @OneToMany(() => TextUnitQueue, (textUnitQueue) => textUnitQueue.organization)
  textUnitQueues: TextUnitQueue[];

  @OneToMany(() => TextUnit, (textUnit) => textUnit.organization)
  textUnits: TextUnit[];

  @OneToMany(() => TextUnitTag, (textUnitTag) => textUnitTag.organization)
  textUnitTags: TextUnitTag[];

  @OneToMany(() => UploadedFile, (uploadedFile) => uploadedFile.organization)
  uploadedFiles: UploadedFile[];

  @Column()
  accessCode: string;

  @Column('simple-json')
  data: OrganizationData;
}
