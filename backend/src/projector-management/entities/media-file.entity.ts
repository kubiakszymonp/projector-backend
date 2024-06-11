import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/base-entity';

@Entity()
export class MediaFile extends AppBaseEntity {
  @Column({
    update: false,
  })
  mimeType: string;

  @Column()
  name: string;

  @Column({
    update: false,
  })
  url: string;

  @Column({
    nullable: true,
  })
  organizationId: string | null;

  @Column({
    update: false,
  })
  size: number;
}
