import { createHash } from 'crypto';

const PREVIEW_FILE_PREFIX = '';

export class CreateUploadedFileDto {
  mimeType: string;
  name: string;
  url: string;
  size: number;
  previewUrl: string;
  buffer: Buffer;
  organization: { id: number };

  constructor(
    name: string,
    mimeType: string,
    sizeBytes: number,
    buffer: Buffer,
    organizationId: number,
  ) {
    this.name = name;
    this.mimeType = mimeType;
    this.size = sizeBytes;
    this.buffer = buffer;
    this.organization = { id: organizationId };
    this.url = this.createHashedName() + '.' + this.getExtension();
    this.previewUrl =
      this.createHashedName() + PREVIEW_FILE_PREFIX + '.' + this.getExtension();
  }

  createHashedName(): string {
    return createHash('sha256')
      .update(
        this.organization.id + this.name + new Date().toISOString(),
        'utf-8',
      )
      .digest('hex');
  }

  getExtension(): string {
    return this.name.split('.').pop();
  }
}
