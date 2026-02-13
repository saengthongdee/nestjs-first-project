import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from '../errors/app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    
    catch(exception: unknown , host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if(exception instanceof AppError) {
            statusCode = exception.statusCode;
            message = exception.message;
        }else if(exception instanceof HttpException) {
            statusCode = exception.getStatus();
            message = exception.message;
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message
        })
    }
}