import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AssetCategory } from '../enums/asset-category.enum.js';

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  asset_id: number;

  @Column()
  asset_name: string;

  @Column({ type: 'integer' })
  stock_quantity: number;

  @Column({ type: 'enum', enum: AssetCategory })
  category: AssetCategory;
}
