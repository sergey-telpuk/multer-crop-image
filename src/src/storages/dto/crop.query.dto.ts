import {IsNotEmpty, IsNumber} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

export class CropQueryDto {
    @ApiModelProperty({
        description: 'left',
        type: Number,
        required: true,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    cl: number;
    @ApiModelProperty({
        description: 'top',
        type: Number,
        required: true,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    ct: number;
    @ApiModelProperty({
        description: 'width',
        type: Number,
        required: true,
    })
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    cw: number;
    @ApiModelProperty({
        description: 'height',
        type: Number,
        required: true,
    })
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    ch: number;
}
