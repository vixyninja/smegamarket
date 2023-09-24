import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {LinkService} from './link.service';
import {AdminGuard} from 'src/auth/guard';

@UseGuards(AdminGuard)
@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('get-all')
  async getAllLinks() {
    return await this.linkService.getLinks();
  }

  @Get('get-one/:id')
  async getOneLink(@Param('id') id: string) {
    return await this.linkService.getLinkById(id);
  }
}
