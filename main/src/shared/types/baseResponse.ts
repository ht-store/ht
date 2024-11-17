export class BaseResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: Error;

  constructor(success: boolean, data?: T, error?: Error, message?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(message: string, data: T): BaseResponse<T> {
    return new BaseResponse(true, data, undefined, message);
  }

  static error(message: string, error: Error) {
    return new BaseResponse(false, undefined, error, message);
  }
}
