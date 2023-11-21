import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ItemsModule } from "./admin/items/items.module";
import { ClientItemsModule } from './client-items/client-items.module';

@Module({
  imports: [ItemsModule, ClientItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
