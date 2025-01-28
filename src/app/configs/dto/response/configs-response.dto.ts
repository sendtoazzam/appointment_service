import { ApiProperty } from '@nestjs/swagger';
import { Configs } from '../../configs.model';
import { AppointmentConfigs } from '../../embedded-model/appointment-configs.embedded-model';

export class ConfigsResponseDTO {
  @ApiProperty({
    description: 'Id belongs to the value',
  })
  id: string;

  @ApiProperty({
    description: 'Appointment configurations',
  })
  appointmentConfigs: AppointmentConfigs;

  @ApiProperty({
    description: 'who create',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Creation date',
  })
  createdAt: Date;

  static fromModel(model: Configs): ConfigsResponseDTO {
    const dto = new ConfigsResponseDTO();
    dto.id = model._id;
    dto.appointmentConfigs = model.appointmentConfigs;
    dto.createdBy = model.createdBy?.userId;
    dto.createdAt = model.createdAt;

    return dto;
  }
}
