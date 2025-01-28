import { Prop } from "@nestjs/mongoose"
import { Days } from "src/common/enum/days.enum"

export class unavailableHours {
    @Prop({
        required: true,
        type: Days
    })
    day: Days

    @Prop({
        required: true,
        default: '18:00'
    })
    hours: string[]
}
