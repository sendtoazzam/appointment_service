import { ApiProperty } from "@nestjs/swagger"
import { Days } from "src/common/enum/days.enum"

export class UnavailableHoursRequestDTO {
    @ApiProperty({ required: true })
    day: Days

    @ApiProperty({ required: true })
    hours: string[]
}
