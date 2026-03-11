import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    // ดึงข้อความ Error ออกมา
    const error = exception instanceof WsException ? exception.getError() : exception;
    
    // ส่งกลับหา User ที่ทำพังคนเดียว
    client.emit('exception', {
      status: 'error',
      message: typeof error === 'object' ? error : { message: error },
    });
  }
}