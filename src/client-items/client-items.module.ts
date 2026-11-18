import { Module } from "@nestjs/common";
import { ClientItemsService } from "./client-items.service";
import { ClientItemsController } from "./client-items.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [ClientItemsController],
  providers: [ClientItemsService, PrismaService],
})
export class ClientItemsModule {}
