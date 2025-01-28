import { CommonException } from "src/common/exception/common.exception";

export class AppointmentStatusException extends CommonException {
    getName(): string {
        return "APPOINTMENT_STATUS_ALREADY_UPDATED";
    }
    
}