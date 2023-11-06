import {CloudinaryModule, JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FileController} from './file.controller';
import {FileEntity} from './file.entity';
import {FileService} from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), CloudinaryModule],
  controllers: [FileController],
  providers: [FileService, JwtService, JWTService],
  exports: [FileService],
})
export class FileModule {}
