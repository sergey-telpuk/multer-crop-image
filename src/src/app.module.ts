import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FactoryProvider} from "@nestjs/common/interfaces";
import {TYPE_STORAGE_IMAGE} from "./config/global.env";
import {StorageFactory} from "./storages/cloud/storage.factory";

export const CropMulterFactory: FactoryProvider = {
  provide: 'ICropAvatar',
  useFactory: () => {
    return StorageFactory.createStorageFromType(TYPE_STORAGE_IMAGE);
  },
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
      AppService,
      CropMulterFactory
  ],
})
export class AppModule {}
