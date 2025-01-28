import { HttpException } from '@nestjs/common';

export abstract class AbstractException extends HttpException {
  constructor(response: string | object, status: number) {
    super(response, status);
  }

  abstract getErrorType(): string;

  getResponse() {
    const res: any = super.getResponse();

    if (typeof res === 'object') {
      res.success = false;
      res.errorType = this.getErrorType();
    } else {
      return {
        statusCode: this.getStatus(),
        success: false,
        errorType: this.getErrorType(),
        message: res,
      };
    }
    return res;
  }
}
