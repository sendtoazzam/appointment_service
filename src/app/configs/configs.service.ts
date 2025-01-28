import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagination } from 'src/common/pagination/pagination';
import { Configs } from './configs.model';
import { ConfigsQueryFilter } from './query-filter/configs.query-filter';
import { ConfigsUpdateRequestDTO } from './dto/request/configs-update.request.dto';
import { ConfigsTypeEnumDTO } from './enum/configs-type-param.enum.dto';
import { InvalidValueException } from 'src/common/exception/invalid-value.exception';
import { ResourceNotFoundException } from 'src/common/exception/resource-not-found.exception';

@Injectable()
export class ConfigsService {
    constructor(
        @InjectModel(Configs.name)
        private readonly ConfigsModel: Model<Configs>,
    ) { }

    async findAll(
        qs: ConfigsQueryFilter,
        paginationMeta: boolean = false,
    ): Promise<Configs[] | Pagination> {
        const conditions = {
            deleted: false,
        };

        return paginationMeta
            ? await qs.getPagination(this.ConfigsModel, conditions)
            : await qs.setMongooseQuery(this.ConfigsModel, conditions);
    }

    async paginationMeta(
        qs: ConfigsQueryFilter,
        paginationMeta: boolean = false,
    ): Promise<Configs[] | Pagination> {
        const conditions = {
            deleted: false,
        };

        return paginationMeta
            ? await qs.getPagination(this.ConfigsModel, conditions)
            : await qs.setMongooseQuery(this.ConfigsModel, conditions);
    }

    async updateAppointmentConfigs(configType: ConfigsTypeEnumDTO, body: ConfigsUpdateRequestDTO): Promise<Configs> {
        const { unavailableHours, holidays, slotDuration, maxSlotPerAppointment, operationHours } = body;
        
        // Fetch configurations (slot duration, operational hours, etc.)
        const configs = await this.ConfigsModel.findOne();
        if (!configs.appointmentConfigs) throw new ResourceNotFoundException('APPOINTMENT_CONFIG_NOT_FOUND');

        let field = {};
    
        const fieldMapping = {
            [ConfigsTypeEnumDTO.unavailableHours]: {
                value: unavailableHours,
                error: 'MISSING_UNAVAILABLE_HOURS_FIELD',
                path: 'appointmentConfigs.unavailableHours'
            },
            [ConfigsTypeEnumDTO.holidays]: {
                value: holidays,
                error: 'MISSING_HOLIDAYS_FIELD',
                path: 'appointmentConfigs.holidays'
            },
            [ConfigsTypeEnumDTO.slotDuration]: {
                value: slotDuration,
                error: 'MISSING_SLOT_DURATION_FIELD',
                path: 'appointmentConfigs.slotDuration'
            },
            [ConfigsTypeEnumDTO.maxSlotPerAppointment]: {
                value: maxSlotPerAppointment,
                error: 'MISSING_MAX_SLOT_PER_APPOINTMENT_FIELD',
                path: 'appointmentConfigs.maxSlotPerAppointment'
            },
            [ConfigsTypeEnumDTO.operationHours]: {
                value: operationHours,
                error: 'MISSING_OPERATION_HOURS_FIELD',
                path: 'appointmentConfigs.operationHours'
            }
        };
    
        const config = fieldMapping[configType];
        if (!config.value) throw new InvalidValueException(config.error);
    
        field[config.path] = config.value;
    
        await this.ConfigsModel.updateOne(
            {},
            {
                $set: field
            }, { new: true }
        );
    
        return await this.ConfigsModel.findOne();
    }
}
