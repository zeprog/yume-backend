import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  constructor(
    private readonly roomService: RoomService,
    private readonly websocketService: WebsocketService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.data = {};

    this.websocketService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;
    if (roomId) {
      this.roomService.removeClientFromRoom(roomId, client.id);
      client.leave(roomId);

      const participants = this.roomService.getRoomClients(roomId);
      this.server.to(roomId).emit('participants-updated', { participants });
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { roomId: string }) {
    const { roomId } = data;

    if (client.data.roomId === roomId) {
      this.logger.log(`Client ${client.id} is already in room ${roomId}`);
      return;
    }

    if (!this.roomService.getRoomClients(roomId).length) {
      this.roomService.createRoom(roomId);
      this.logger.log(`Room ${roomId} created.`);
    }

    if (client.data.roomId) {
      this.handleLeaveRoom(client, { roomId: client.data.roomId });
    }

    client.data.roomId = roomId;
    this.roomService.addClientToRoom(roomId, client.id);
    client.join(roomId);

    const participants = this.roomService.getRoomClients(roomId);
    this.server.to(roomId).emit('participants-updated', { participants });

    this.logger.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, data: { roomId: string }) {
    const { roomId } = data;

    if (client.data.roomId !== roomId) {
      this.logger.warn(`Client ${client.id} is not in room ${roomId}`);
      return;
    }

    this.roomService.removeClientFromRoom(roomId, client.id);
    client.leave(roomId);
    client.data.roomId = null;

    const participants = this.roomService.getRoomClients(roomId);
    this.server.to(roomId).emit('participants-updated', { participants });

    this.logger.log(`Client ${client.id} left room ${roomId}`);
  }
}
