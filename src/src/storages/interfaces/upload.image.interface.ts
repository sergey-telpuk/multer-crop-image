import {CropQueryDto} from "../dto/crop.query.dto";


export interface IUploadImage {
    /**
     *
     * @param value
     */
    setFilename(value: string);

    /**
     *
     * @param value
     */
    setCroppedPrefix(value: string): IUploadImage;

    /**
     *
     * @param value
     */
    setCroppedPayload(value: CropQueryDto): IUploadImage;

    getMulter(): any;
}
