import { Test, TestingModule } from "@nestjs/testing";
import { ClientItemsService } from "./client-items.service";
import { PrismaService } from "../prisma/prisma.service";

describe("ClientItemsService", () => {
  let service: ClientItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientItemsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ClientItemsService>(ClientItemsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
