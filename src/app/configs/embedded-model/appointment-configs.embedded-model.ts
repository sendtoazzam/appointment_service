import { Prop } from "@nestjs/mongoose";
import { OperationHours } from "./operation-hours.embedded-model";
import { unavailableHours } from "./unavailable-hours.embedded-model";

export class AppointmentConfigs {
    @Prop({
        required: true,
        default: 30
    })
    slotDuration: number = 20;

    @Prop({
        required: true,
        default: 1
    })
    maxSlotPerAppointment: number;
    
    @Prop({
        required: true,
        default: []
    })
    operationHours: OperationHours;

    @Prop({
        required: true,
        default: 1
    })
    unavailableHours: unavailableHours[];

    @Prop({
        required: true,
    })
    holidays: string[];
}