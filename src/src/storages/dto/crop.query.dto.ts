import {IsNotEmpty, IsNumber} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

export class CropQueryDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    cl: number;
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    ct: number;
    @ApiProperty()
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    cw: number;
    @ApiProperty()
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    ch: number;
}
