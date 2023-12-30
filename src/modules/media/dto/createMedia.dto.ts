export class CreateMediaDTO {
  publicId: string;
  signature: string;
  version: number;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  url: string;
  secureUrl: string;
  bytes: number;
  assetId: string;
  versionId: string;
  tags: string[];
  etag: string;
  placeholder: boolean;
  originalFilename: string;
  apiKey: string;
  folder: string;
  constructor(partial: Partial<CreateMediaDTO>) {
    Object.assign(this, partial);
  }
}
