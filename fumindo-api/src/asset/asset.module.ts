import { Module } from '@nestjs/common';
import { AssetService } from './asset.service.js';
import { AssetController } from './asset.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
