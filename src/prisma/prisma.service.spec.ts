import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
  let service: PrismaService;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    process.env.DATABASE_URL =
      "postgresql://test:test@localhost:5020/lobsterlist?schema=public";
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await service.$disconnect();
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it("connects when the module initializes", async () => {
    const connect = jest.spyOn(service, "$connect").mockResolvedValue();
    await service.onModuleInit();
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("releases database connections when the module closes", async () => {
    const disconnect = jest.spyOn(service, "$disconnect").mockResolvedValue();
    await service.onModuleDestroy();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("reports missing database configuration before connecting", () => {
    delete process.env.DATABASE_URL;
    expect(() => new PrismaService()).toThrow("DATABASE_URL must be set");
  });

  it("reports malformed database URLs without exposing their contents", () => {
    process.env.DATABASE_URL = "invalid-database-url-with-a-secret";
    expect(() => new PrismaService()).toThrow(
      "DATABASE_URL must be a valid PostgreSQL connection URL",
    );
  });
});
