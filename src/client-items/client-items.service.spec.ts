import { Test, TestingModule } from '@nestjs/testing';
import { ClientItemsService } from './client-items.service';

describe('ClientItemsService', () => {
  let service: ClientItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientItemsService],
    }).compile();

    service = module.get<ClientItemsService>(ClientItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
