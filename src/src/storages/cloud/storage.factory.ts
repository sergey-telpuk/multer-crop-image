import {FtpStorageAdapter} from './adapters/ftp.storage.adapter';
import {ALLOW_AVATAR_FILE, TYPE_STORAGE} from '../../config/global.env';
import {AwsStorageAdapter} from './adapters/aws.storage.adapter';
import {IUploadImage} from "../interfaces/upload.image.interface";

export class StorageFactory {
    static createStorageFromType(type: string): IUploadImage {
        switch (type) {
            case TYPE_STORAGE.FTP:
                return new FtpStorageAdapter({
                        fileFilter(req, file, cb) {
                            if (!ALLOW_AVATAR_FILE.includes(file.mimetype)) {
                                return cb(new Error(`Only ${ALLOW_AVATAR_FILE.join(', ')} are allowed.`));
                            }

                            cb(null, true);
                        },
                    },
                );
            case TYPE_STORAGE.AWS: {
                return new AwsStorageAdapter({
                    fileFilter(req, file, cb) {
                        if (!ALLOW_AVATAR_FILE.includes(file.mimetype)) {
                            return cb(new Error(`Only ${ALLOW_AVATAR_FILE.join(', ')} are allowed.`));
                        }

                        cb(null, true);
                    },
                });
            }
            default:
                return null;
        }
    }
}
