import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { AssetCategory } from '../enums/asset-category.enum.js';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  asset_name: string;

  @IsInt()
  @Min(0)
  stock_quantity: number;

  @IsEnum(AssetCategory)
  category: AssetCategory;
}
