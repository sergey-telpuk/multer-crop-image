import uuid4 from 'uuid/v4';
import fs from 'fs';
import sharp from 'sharp';
import {CropQueryDto} from "../dto/crop.query.dto";
import {IUploadImage} from "../interfaces/upload.image.interface";

export abstract class StorageAbstract implements IUploadImage {

    protected filename: string;
    protected croppedPayload: CropQueryDto;
    protected croppedPrefix: string;

    private multer: any;

    protected constructor() {
    }

    protected setMulter(multer: any) {
        this.multer = multer;
    }

    setFilename(value): IUploadImage {
        this.filename = value;
        return this;
    }

    setCroppedPrefix(value: string): IUploadImage {
        this.croppedPrefix = value;
        return this;
    }

    setCroppedPayload(value: CropQueryDto): IUploadImage {
        this.croppedPayload = value;
        return this;
    }

    getMulter(): any {
        return this.multer;
    }

    protected async saveAsTemp(file): Promise<string> {
        return new Promise((resolve, reject) => {
            const tmpFile = '/tmp/' + uuid4();
            const writeStream = fs.createWriteStream(tmpFile);
            file.stream
                .pipe(writeStream)
                .on('error', error => reject(error))
                .on('finish', () => resolve(tmpFile));
        });
    }

    protected async resize(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const tmpFile = '/tmp/' + uuid4();
            let readStream = fs.createReadStream(file as string);
            const writeStream = fs.createWriteStream(tmpFile);

            if (Object.keys(this.croppedPayload).length !== 0) {
                const {cw, ch, cl, ct} = this.croppedPayload;
                readStream = readStream.pipe(sharp().extract({
                    left: cl,
                    top: ct,
                    width: cw,
                    height: ch,
                }));
            }

            readStream
                .pipe(writeStream)
                .on('error', error => reject(error))
                .on('finish', () => resolve(tmpFile));

        });
    }

    protected reset() {
        this.setFilename(null);
        this.setCroppedPrefix(null);
        this.setCroppedPayload({
            ch: 0,
            cl: 0,
            cw: 0,
            ct: 0,
        });
    }
}
