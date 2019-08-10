import FtpStorage from 'multer-ftp';
import fs from 'fs';
import path from 'path';
import {FTP_STORAGE} from '../../../config/global.env';
import {Options, StorageEngine} from 'fastify-multer/lib/interfaces';
import {StorageAbstract} from '../storage.abstract';
import multer from 'fastify-multer';

export class FtpStorageAdapter extends StorageAbstract implements StorageEngine {

    private readonly storage;
    private readonly storageForCropping;

    constructor(options: Options | undefined) {
        super();

        this.setMulter(multer(
            {
                ...options,
                storage: this,
            },
        ).single('file'));

        this.storage = new FtpStorage({...FTP_STORAGE});
        this.storageForCropping = new FtpStorage({...FTP_STORAGE});
    }

    async _handleFile(req, file, cb) {
        const filePath = await this.saveAsTemp(file);

        await this.resize(filePath).then((resizedFile) => {
            this.storageForCropping.opts.destination = (inReq, inFile, inOpts, inCb) => {
                inCb(null, this.croppedPrefix + this.filename + path.extname(inFile.originalname));
            };
            this.storageForCropping._handleFile(req, {
                ...file,
                stream: fs.createReadStream(resizedFile as string),
            }, (err, destination) => {
                if (err) {
                    Promise.reject(err);
                }
                Promise.resolve(true);
            });
        });

        const storage: any = await new Promise((resolve, reject) => {
            this.storage.opts.destination = (inReq, inFile, inOpts, inCb) => {
                inCb(null, this.filename + path.extname(inFile.originalname));
            };
            this.storage._handleFile(req,
                {
                    ...file,
                    stream: fs.createReadStream(filePath as string),
                },
                (err, destination) => {
                    resolve(() => cb(err, destination));
                });
        });

        this.reset();

        storage();
    }

    async _removeFile(req, file, cb) {
        this.reset();
    }
}
