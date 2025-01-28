import { ValidationErrorType } from '../enum/validation-error.enum';
import { ValidationException } from './validation.exception';

export class GeneralValidationException extends ValidationException {
  constructor(
    private readonly exceptionName: string,
    private readonly msg: string,
  ) {
    super(msg);
  }

  getCode(): number {
    return ValidationErrorType.InvalidValue;
  }

  getName(): string {
    return this.exceptionName;
  }
}
