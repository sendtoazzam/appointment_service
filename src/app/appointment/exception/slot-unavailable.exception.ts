import { CommonException } from "src/common/exception/common.exception";

export class SlotUnavailableException extends CommonException {
    getName(): string {
        return "SLOT_UNAVAILABLE";
    }
    
}