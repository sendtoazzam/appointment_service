import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class LogAuditDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    recordId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsObject()
    payload: object;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
}
