import { HttpStatus } from '@nestjs/common';
import { AbstractException } from 'src/common/exception/abstract.exception';

export class UserNotFoundException extends AbstractException {
  constructor() {
    super('Authenticate failed', HttpStatus.UNAUTHORIZED);
  }

  getErrorType() {
    return 'auth_failed';
  }
}
