
export class StorageException extends Error {
    constructor(message?: string) {
        super('Storage Exception: ' + message);
    }

}
