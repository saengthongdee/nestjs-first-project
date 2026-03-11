import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../../common/interfaces/socket-event.enum';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';

@WebSocketGateway({
  namespace: 'auctions',
  cors: { origin: '*' },
})
@UseFilters(new WsExceptionFilter())
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // รับ Token จากหน้าบ้าน (auth: { token: '...' })
    const token = client.handshake.auth?.token;
    console.log(`[Socket] Connected: ${client.id} | Token: ${token ? 'Present' : 'None'}`);
  }

  @SubscribeMessage(SocketEvent.JOIN_AUCTION)
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('auctionId') auctionId: string,
  ) {
    if (!auctionId) return;

    const roomName = `auction:${auctionId}`;
    await client.join(roomName);

    // อัปเดตจำนวนคนดูให้ทุกคนในห้องเห็น
    this.sendViewersUpdate(roomName);
  }

  @SubscribeMessage(SocketEvent.LEAVE_AUCTION)
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody('auctionId') auctionId: string,
  ) {
    const roomName = `auction:${auctionId}`;
    await client.leave(roomName);

    this.sendViewersUpdate(roomName);
  }

  // ฟังก์ชันช่วยนับจำนวนคนในห้อง
  private sendViewersUpdate(roomName: string) {

    const viewerCount = this.server.sockets.adapter.rooms.get(roomName)?.size || 0;
    this.server.to(roomName).emit(SocketEvent.VIEWERS_UPDATE, { count: viewerCount });
  }

  // 🚀 สำหรับให้ BidsService เรียกใช้ตอนมีคนบิดราคาใหม่
  broadcastPriceUpdate(auctionId: string, payload: any) {
    this.server.to(`auction:${auctionId}`).emit(SocketEvent.PRICE_UPDATE, payload);
  }
}