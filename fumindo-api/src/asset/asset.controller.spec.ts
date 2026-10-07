import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller.js';
import { AssetService } from './asset.service.js';

describe('AssetController', () => {
  let controller: AssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [AssetService],
    }).compile();

    controller = module.get<AssetController>(AssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
