import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { Is5LegacyExceptionFilter } from './exceptions/is5-legacy-exception.filter';
import { Is5LegacyValidationPipe } from './pipes/is5-legacy-validation.pipe';
import { join } from 'path';

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
  app.useStaticAssets(join(__dirname, '..', 'data'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(port || 3000);
}
bootstrap();
