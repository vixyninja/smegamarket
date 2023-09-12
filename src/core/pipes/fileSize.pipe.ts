import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class FileSizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value.size < 5000;
  }
}
