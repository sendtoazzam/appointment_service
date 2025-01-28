import { BaseException } from './base.exception';
import { ExceptionErrorType } from '../enum/exception-error.enum';
import { CommonErrorType } from '../enum/common-error.enum';

export abstract class CommonException extends BaseException {
  getNamespace(): string {
    return process.env.APP_NAMESPACE;
  }

  getType(): ExceptionErrorType {
    return ExceptionErrorType.Exception;
  }

  getCode(): number {
    return CommonErrorType.SomethingWentWrong;
  }
}
