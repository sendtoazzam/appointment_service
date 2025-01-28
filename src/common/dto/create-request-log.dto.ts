import { ApiProperty } from '@nestjs/swagger';
import { Created } from '../type/created.type';
import { Endpoint } from '../type/endpoint.type';

export class CreateRequestLogDTO {
    @ApiProperty()
    status: boolean;

    @ApiProperty()
    endpoint: Endpoint;

    @ApiProperty()
    request: object;

    @ApiProperty()
    response: object | unknown;

    @ApiProperty()
    createdBy: Created;
}
