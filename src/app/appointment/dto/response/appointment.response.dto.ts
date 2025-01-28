import { Appointment } from "../../appointment.model";
import { AppointmentDTO } from "../appointment.dto";

export class AppointmentResponseDTO {
    id: string;
    name: string;
    email: string;
    date: string;
    time:  string;
    status: string;

    static fromModel(model: Appointment): AppointmentResponseDTO {
        const dto = new AppointmentResponseDTO();
        dto.id = model._id;
        dto.name = model.name;
        dto.email = model.email ?? null
        dto.date = model.date;
        dto.time = model.time;
        dto.status = model.appointmentStatus;

        return dto;
    }
}