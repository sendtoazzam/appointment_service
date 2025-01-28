import { Prop } from "@nestjs/mongoose";

export class AppointmentDetails {
    @Prop({ required: true })
    date: string;
    
    @Prop({ required: true })
    time: string;
    
    @Prop({ required: true })
    available_slots: number;

    @Prop({ required: true, default: null })
    appointmentId?: string;

    @Prop({ required: true, default: null })
    bookedAt?: Date;

    @Prop({ required: true, default: null })
    updatedAt?: Date;
}