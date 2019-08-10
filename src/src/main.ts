import {NestFactory} from '@nestjs/core';;
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as fs from 'fs';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {AppModule} from "./app.module";


(async function bootstrap() {
  const app: INestApplication = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        http2: true,
        logger: true,
        https: {
          allowHTTP1: true, // fallback support for HTTP1
          key: fs.readFileSync('./certs/server.key'),
          cert: fs.readFileSync('./certs/server.crt'),
        },
      }));
  app.enableCors();

  await app.listen(3000, '0.0.0.0');
})();