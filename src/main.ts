import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ResponseDTO } from './common/dto/response.dto';
import envValidator from './common/util/env-validator';
import { requiredEnvKeys } from './required-env';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transformer.interceptor';
import { AuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/role.guard';

/**
 * init the swagger docs for the application
 * @param app Nest Application Instance
 */
function initSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(process.env.npm_package_name || 'API')
    .setDescription(process.env.npm_package_description)
    .setVersion(process.env.npm_package_version || '1.0')
    .addBearerAuth(
      { type: 'apiKey', in: 'header', name: 'x-auth-user-data' },
      'x-auth-user-data',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [ResponseDTO],
  });

  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  let bodyLimit: string | number = process.env.APP_MAX_BODY_LIMIT || '12mb';
  bodyLimit = isNaN(+bodyLimit) ? bodyLimit : +bodyLimit;

  app.use(json({ limit: bodyLimit }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));

  // LoggerCommonInitialiser.init(app);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  
  app.setGlobalPrefix('v1');
  
  // swagger only available in non production
  if (process.env.NODE_ENV !== 'production') {
    initSwagger(app);
  }

  app.enableCors();

  await app.listen(process.env.PORT);
}

// to ensure all the env required fill in. Error thrown if missing keys
envValidator(requiredEnvKeys);

bootstrap();
