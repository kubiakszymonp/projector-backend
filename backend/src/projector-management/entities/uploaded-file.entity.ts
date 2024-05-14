import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Organization } from './organization.entity';

@Entity()
export class UploadedFile extends BaseEntity {
  @Column()
  mimeType: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Organization, (organization) => organization.uploadedFiles, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization | null;

  organizationId: number | null;

  @Column()
  size: number;

  @Column()
  previewUrl: string;
}
