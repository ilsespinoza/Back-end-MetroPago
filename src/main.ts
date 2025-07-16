import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Para el webhook de Stripe: habilitar raw body en la ruta /stripe/webhook
  app.use(
    '/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  // Para otras rutas usar JSON normal
  app.use(bodyParser.json());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
