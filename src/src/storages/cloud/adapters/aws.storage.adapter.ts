import * as AwsStorage from 'multer-s3';
import * as fs from 'fs';
import * as AwsS3 from 'aws-sdk/clients/s3';
import * as path from 'path';
import {Options, StorageEngine} from 'fastify-multer/lib/interfaces';
import {StorageAbstract} from '../storage.abstract';
import multer from 'fastify-multer';
import {AWS_STORAGE} from '../../../config/global.env';

export class AwsStorageAdapter extends StorageAbstract implements StorageEngine {

    private readonly storage;
    private readonly storageForCropping;

    private readonly AWS_CONFIG = {
        s3: new AwsS3({
            credentials: {
                accessKeyId: AWS_STORAGE.AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_STORAGE.AWS_SECRET_ACCESS_KEY,
            },
            s3ForcePathStyle: AWS_STORAGE.AWS_S3_FORCE_PATH_STYLE,
            s3BucketEndpoint: AWS_STORAGE.AWS_S3_BUCKET_ENDPOINT,
            endpoint: AWS_STORAGE.AWS_ENDPOINT,
        }),
        acl: AWS_STORAGE.AWS_ACL,
        bucket: AWS_STORAGE.AWS_BUCKET,
    };

    constructor(options: Options | undefined) {
        super();

        this.setMulter(multer(
            {
                ...options,
                storage: this,
            },
        ).single('file'));

        this.storage = new AwsStorage({
            ...this.AWS_CONFIG,
        });

        this.storageForCropping = AwsStorage({
            ...this.AWS_CONFIG,
        });
    }

    async _handleFile(req, file, cb) {

        const filePath = await this.saveAsTemp(file);

        await this.resize(filePath).then((resizedFile) => {
            this.storageForCropping.getKey = (inReq, inFile, inCb) => {
                inCb(null, this.croppedPrefix + this.filename + path.extname(inFile.originalname));
            };

            this.storageForCropping.getContentType = (inReq, inFile, inCb) => {
                inCb(null, inFile.mimetype);
            };

            this.storageForCropping.getMetadata = (inReq, inFile, inCb) => {
                inCb(null, {fieldName: inFile.fieldname});
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
            this.storage.getKey = (inReq, inFile, inCb) => {
                inCb(null, this.filename + path.extname(inFile.originalname));
            };

            this.storage.getContentType = (inReq, inFile, inCb) => {
                inCb(null, inFile.mimetype);
            };

            this.storage.getMetadata = (inReq, inFile, inCb) => {
                inCb(null, {fieldName: inFile.fieldname});
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
