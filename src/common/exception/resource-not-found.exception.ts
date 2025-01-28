import { CommonErrorType } from '../enum/common-error.enum';
import { CommonErrorName } from '../enum/error-name/common-error-name.enum';
import { CommonException } from './common.exception';

export class ResourceNotFoundException extends CommonException {
  getCode(): number {
    return CommonErrorType.ResourceNotFound;
  }

  getName(): string {
    return CommonErrorName.ResourceNotFound;
  }
}
