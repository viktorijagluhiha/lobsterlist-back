import { Test, TestingModule } from '@nestjs/testing';
import { ClientItemsController } from './client-items.controller';
import { ClientItemsService } from './client-items.service';

describe('ClientItemsController', () => {
  let controller: ClientItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientItemsController],
      providers: [ClientItemsService],
    }).compile();

    controller = module.get<ClientItemsController>(ClientItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
