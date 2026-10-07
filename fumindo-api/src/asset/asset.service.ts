import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity.js';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);

    return this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({
      order: {
        asset_id: 'ASC',
      },
    });
  }

  async findOne(asset_id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: {
        asset_id,
      },
    });

    if (!asset) {
      throw new NotFoundException(`Asset ${asset_id} not found`);
    }

    return asset;
  }

  async update(
    asset_id: number,
    updateAssetDto: UpdateAssetDto,
  ): Promise<Asset> {
    const asset = await this.findOne(asset_id);

    Object.assign(asset, updateAssetDto);

    return this.assetRepository.save(asset);
  }

  async remove(asset_id: number): Promise<void> {
    const asset = await this.findOne(asset_id);

    await this.assetRepository.remove(asset);
  }
}
