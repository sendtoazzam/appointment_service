import { CommonException } from "src/common/exception/common.exception";

export class SlotExceedingMoreThanAllowedException extends CommonException {
    getName(): string {
        return "SLOT_EXCEEDING_MORE_THAN_ALLOWED";
    }
    
}