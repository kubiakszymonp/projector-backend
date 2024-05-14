import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from 'src/common/base-entity';

@Entity()
export class UploadedFile extends AppBaseEntity {
  @Column()
  mimeType: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  organizationId: number | null;

  @Column()
  size: number;

  @Column()
  previewUrl: string;
}
