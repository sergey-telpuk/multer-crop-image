import * as fs from 'fs';
import * as path from 'path';
import {Options, StorageEngine} from 'fastify-multer/lib/interfaces';
import {StorageAbstract} from '../storage.abstract';
import * as multer from 'fastify-multer';

export class LocalStorageAdapter extends StorageAbstract implements StorageEngine {

    private readonly storage;
    private readonly storageForCropping;


    constructor(options: Options | undefined) {
        super();

        let storage1 = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, '/app/uploads')
            },
            filename: (req, file, cb) => {
                cb(null, this.filename + path.extname(file.originalname));
            }
        });
        let storage2 = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, '/app/uploads')
            },
            filename:(req, file, cb)=>{
                cb(null, this.croppedPrefix + this.filename + path.extname(file.originalname));
            }
        });

        this.setMulter(multer(
            {
                ...options,
                storage: this,
            },
        ).single('file'));

        this.storage = storage1;
        this.storageForCropping = storage2;
    }

    async _handleFile(req, file, cb) {
        const filePath = await this.saveAsTemp(file);
        await this.resize(filePath).then((resizedFile) => {
            this.storageForCropping._handleFile(req,
                {
                ...file,
                stream: fs.createReadStream(resizedFile as string),
            },
                (err, destination) => {
                if (err) {
                    Promise.reject(err);
                }
                Promise.resolve(true);
            }
            );
        }).catch((e) => cb(e));

        const storage: any = await new Promise((resolve, reject) => {
            this.storage._handleFile(req,
                {
                    ...file,
                    stream: fs.createReadStream(filePath as string),
                },
                (err, destination) => {
                    resolve(() => cb(err, destination));
                });
        }).catch((e) => cb(e));

        this.reset();

        storage();
    }

    async _removeFile(req, file, cb) {
        this.reset();
    }
}
