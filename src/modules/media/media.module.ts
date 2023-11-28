import {CloudinaryModule, JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MediaController} from './media.controller';
import {MediaEntity} from './entities/media.entity';
import {MediaService} from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity]), CloudinaryModule],
  controllers: [MediaController],
  providers: [MediaService, JwtService, JWTService],
  exports: [MediaService],
})
export class MediaModule {}
