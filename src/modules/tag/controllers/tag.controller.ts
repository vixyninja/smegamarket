import {Controller} from '@nestjs/common';
import {TagService} from '../services';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}
}
