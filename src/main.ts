import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { Is5LegacyExceptionFilter } from './exceptions/is5-legacy-exception.filter';
import { Is5LegacyValidationPipe } from './pipes/is5-legacy-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new Is5LegacyExceptionFilter(),
  );
  app.useGlobalPipes(new Is5LegacyValidationPipe());
  app.enableCors();
  await app.listen(port || 3000);
}
bootstrap();
