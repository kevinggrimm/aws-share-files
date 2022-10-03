import type { _Object } from '@aws-sdk/client-s3';

import { FileInfo } from './FileInfo';
import { S3BaseContent } from './S3BaseContent';

export class S3File extends S3BaseContent {
  public FileInfo: FileInfo;

  public FileName: string;

  constructor(file: _Object) {
    super(file);

    this.FileName = this.Hierarchy[this.Hierarchy.length - 1];

    this.FileInfo = new FileInfo(this.FileName);
  }
}
