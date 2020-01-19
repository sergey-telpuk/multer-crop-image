import {NestFactory} from '@nestjs/core';;
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as fs from 'fs';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {AppModule} from "./app.module";
import * as fmp from 'fastify-multipart';

(async function bootstrap() {

    const fastifyAdapter = new FastifyAdapter({
        http2: true,
        logger: true,
        https: {
          allowHTTP1: true, // fallback support for HTTP1
          key: fs.readFileSync('./certs/server.key'),
          cert: fs.readFileSync('./certs/server.crt'),
        },
    });

    fastifyAdapter.register(fmp, {
        limits: {
            fieldNameSize: 100, // Max field name size in bytes
            fieldSize: 1000000, // Max field value size in bytes
            fields: 10,         // Max number of non-file fields
            fileSize: 100,      // For multipart forms, the max file size
            files: 1,           // Max number of file fields
            headerPairs: 2000,   // Max number of header key=>value pairs
        },
    });
    const app: INestApplication = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyAdapter,
    );
    app.enableCors();


    await app.listen(3000, '0.0.0.0');
})();