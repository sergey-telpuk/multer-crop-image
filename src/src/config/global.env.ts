export const enum TYPE_STORAGE {
    AWS = 'AWS',
    FTP = 'FTP',
    LOCAL = 'LOCAL',
}

export const TYPE_STORAGE_IMAGE = process.env.TYPE_STORAGE;

export const ALLOW_AVATAR_FILE: string[] = ['image/png', 'image/jpeg'];

// FOR TESTING
export const FTP_STORAGE = {
    basepath: process.env.FTP_STORAGE_BASE_PATH,
    ftp: {
        host: process.env.FTP_STORAGE_HOST,
        secure: JSON.parse(process.env.FTP_STORAGE_SECURE),
        user: process.env.FTP_STORAGE_USER,
        password: process.env.FTP_STORAGE_PASSWORD,
    },
};

export const AWS_STORAGE = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ENDPOINT: process.env.AWS_ENDPOINT,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_ACL: process.env.AWS_ACL,
    AWS_S3_FORCE_PATH_STYLE: JSON.parse(process.env.AWS_S3_FORCE_PATH_STYLE),
    AWS_S3_BUCKET_ENDPOINT: JSON.parse(process.env.AWS_S3_BUCKET_ENDPOINT),
};
