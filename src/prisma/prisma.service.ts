import "dotenv/config";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL must be set in the environment or .env file",
      );
    }

    let schema: string;
    try {
      schema = new URL(connectionString).searchParams.get("schema") ?? "public";
    } catch {
      throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
    }
    super({
      adapter: new PrismaPg(
        { connectionString, connectionTimeoutMillis: 5000 },
        { schema },
      ),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
