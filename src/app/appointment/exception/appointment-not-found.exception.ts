import { ResourceNotFoundException } from "src/common/exception/resource-not-found.exception";

export class AppointmentNotFoundException extends ResourceNotFoundException {
    getName(): string {
        return "APPOINTMENT_NOT_FOUND";
    }
    
}