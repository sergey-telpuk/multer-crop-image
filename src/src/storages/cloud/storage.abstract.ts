import { CropQueryDto } from '../dto/crop.query.dto';
import * as uuid4 from 'uuid/v4';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { StorageException } from '../exceptions/storage.exception';
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

    protected async resize(file: string): Promise<any> {
        try {
            return await new Promise((resolve, reject) => {
                const tmpFile = '/tmp/' + uuid4();
                let readStream = fs.createReadStream(file as string);
                const writeStream = fs.createWriteStream(tmpFile);

                if (Object.keys(this.croppedPayload).length !== 0) {
                    const {cw, ch, cl, ct} = this.croppedPayload;
                    const sharpPipe = sharp().extract({
                        left: parseInt(String(cl),10),
                        top: parseInt(String(ct),10),
                        width: parseInt(String(cw),10),
                        height: parseInt(String(ch),10),
                    });

                    readStream = readStream.pipe(sharpPipe)
                        .on('error', err => reject(err));
                }
                readStream
                    .pipe(writeStream)
                    .on('error', error => reject(error))
                    .on('finish', () => resolve(tmpFile));

            });
        } catch (e) {
            throw new StorageException(e);
        }
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
