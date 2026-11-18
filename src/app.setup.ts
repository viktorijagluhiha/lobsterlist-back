import { ValidationPipe } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";

export function configureApp(app: INestApplication) {
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );
}
