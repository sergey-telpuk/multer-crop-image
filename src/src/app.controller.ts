import {Controller, Inject, Post, Query, Req, Res} from '@nestjs/common';
import {IUploadImage} from "./storages/interfaces/upload.image.interface";
import {CropQueryDto} from "./storages/dto/crop.query.dto";
import uuid4 from 'uuid/v4';

@Controller()
export class AppController {
    constructor(
        @Inject('IUploadImage')
        private readonly uploadImage: IUploadImage,
    ) {
    }


    @Post('/')
    async create(
        @Query() cropQueryDto: CropQueryDto,
        @Req() req,
        @Res() res,
    ): Promise<CropQueryDto> {
        return new Promise((resolve, reject) => {
            this.uploadImage
                .setFilename(uuid4)
                .setCroppedPrefix('__cropped__')
                .setCroppedPayload(cropQueryDto)
                .getMulter()(req, res, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(req.file);
                });
        })
    }
}
