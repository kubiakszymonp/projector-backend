import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../../common/base-entity';
import { DisplayTypeEnum } from '../enums/display-type.enum';
import { MediaFile } from './media-file.entity';

@Entity()
export class DisplayState extends AppBaseEntity {
  @Column({
    default: DisplayTypeEnum.TEXT
  })
  displayType: DisplayTypeEnum;

  @Column({
    default: 0
  })
  textUnitId: number;

  @Column({
    default: 0
  })
  textUnitPart: number;

  @Column({
    default: 0
  })
  textUnitPartPage: number;

  @Column({
    default: 0
  })
  textUnitQueueId: number;

  @Column({
    default: true
  })
  emptyDisplay: boolean;

  @Column()
  organizationId: number;

  @OneToOne(() => MediaFile)
  @JoinColumn({ name: 'mediaFileId' })
  mediaFile?: MediaFile | null;

  @Column({
    nullable: true
  })
  mediaFileId?: number | null;
}
