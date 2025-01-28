import { HttpStatus } from '@nestjs/common';
import { AbstractException } from 'src/common/exception/abstract.exception';

export class UserAlreadyRegister extends AbstractException {
  constructor(private readonly info?: string) {
    super(`User ${info} already registered`, HttpStatus.CONFLICT);
  }

  getErrorType() {
    return 'register_failed';
  }
}
