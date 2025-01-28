import { IsNotEmpty, IsObject, IsOptional, IsString, Matches, Validate } from 'class-validator';
import { Days } from 'src/common/enum/days.enum';
import { BaseQueryParamDto } from 'src/common/query-params/base-dto.queryparam';


class OperationHours {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in the format HH:mm and within a valid range (00:00 to 23:59)',
  })
  start: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in the format HH:mm and within a valid range (00:00 to 23:59)',
  })
  end: string;
}

class unavailableHours {
  @IsString()
  @IsNotEmpty()
  day: Days;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in the format HH:mm and within a valid range (00:00 to 23:59)',
  })
  hours: string[];
}

export class ConfigsUpdateRequestDTO extends BaseQueryParamDto {
  @IsOptional()
  @IsObject()
  operationHours: OperationHours;

  @IsOptional()
  holidays: string[];

  @IsOptional()
  unavailableHours: unavailableHours

  @IsOptional()
  maxSlotPerAppointment: number;

  @IsOptional()
  slotDuration: number;
}
