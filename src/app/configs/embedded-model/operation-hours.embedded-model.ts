import { Prop } from "@nestjs/mongoose"

export class OperationHours {
    @Prop({
        required: true,
        default: '09:00'
    })
    start: string

    @Prop({
        required: true,
        default: '18:00'
    })
    end: number
}
