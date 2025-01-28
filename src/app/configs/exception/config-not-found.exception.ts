import { CommonException } from "src/common/exception/common.exception";

export class ConfigNotFound extends CommonException {
    getName(): string {
        return "CONFIG_NOT_FOUND";
    }
    
}