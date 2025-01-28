import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { Pagination } from 'src/common/pagination/pagination';
import { Configs } from './configs.model';
import { ConfigsResponseDTO } from './dto/response/configs-response.dto';
import { ConfigsQueryFilter } from './query-filter/configs.query-filter';
import { ConfigsService } from './configs.service';
import { ConfigsRequestDTO } from './dto/request/configs.request.dto';
import { ConfigsUpdateRequestDTO } from './dto/request/configs-update.request.dto';
import { ConfigsTypeEnumDTO } from './enum/configs-type-param.enum.dto';

@Controller('configs')
export class ConfigsController {
    constructor(private readonly configsService: ConfigsService) { }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        type: Object
    })
    async findAll(
        @Query() query: ConfigsRequestDTO,
    ): Promise<ConfigsResponseDTO[] | Pagination> {
        const queryFilter = new ConfigsQueryFilter(query);

        if (queryFilter.hasPaginationMeta()) {
            return this.configsService.paginationMeta(
                queryFilter,
                true,
            ) as Promise<Pagination>;
        }

        const ConfigsList = (await this.configsService.findAll(
            queryFilter,
        )) as Configs[];

        return ConfigsList.map(ConfigsResponseDTO.fromModel);
    }

    @Public()
    @Put('appointment/:configType')
    async setUnavailableHours(
        @Param('configType') configType: ConfigsTypeEnumDTO,
        @Body() body: ConfigsUpdateRequestDTO,
    ): Promise<ConfigsResponseDTO> {
        const unavailableHours = await this.configsService.updateAppointmentConfigs(configType, body);
        return ConfigsResponseDTO.fromModel(unavailableHours);
    }
}

