import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Catch,
} from '@nestjs/common';
import { ValidationErrorType } from '../enum/validation-error.enum';
import { ExceptionErrorType } from '../enum/exception-error.enum';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    if (status === 400) {
      response.status(200).json({
        success: false,
        data: null,
        error: {
          type: ExceptionErrorType.Validation,
          code: ValidationErrorType.InvalidValue,
          message: exception.getResponse()['message'],
        },
      });
    } else {
      response.status(status).json(exception.getResponse());
    }
  }
}
