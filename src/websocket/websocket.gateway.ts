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

  private generateRandomNickname(): string {
    const adjectives = ['Bright', 'Clever', 'Brave', 'Calm', 'Quick', 'Happy'];
    const animals = ['Tiger', 'Fox', 'Bear', 'Eagle', 'Shark', 'Wolf'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${adjective} ${animal}`;
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const nickname = this.generateRandomNickname();
    client.data.nickname = nickname;

    client.emit('nickname-assigned', { nickname });
    this.logger.log(`Nickname "${nickname}" assigned to client ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;

    if (roomId) {
      const nickname = client.data.nickname || 'Anonymous';
      this.roomService.removeClientFromRoom(roomId, client.id);
      client.leave(roomId);

      const participants = this.roomService.getRoomClients(roomId);
      this.server.to(roomId).emit('participants-updated', { participants });

      this.server.to(roomId).emit('receiveMessage', {
        type: 'notification',
        message: `${nickname} вышел из комнаты.`,
      });
    }

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, data: { roomId: string }) {
    const { roomId } = data;

    if (!roomId || typeof roomId !== 'string') {
      client.emit('error', { message: 'Invalid room ID' });
      this.logger.warn(`Client ${client.id} provided invalid room ID`);
      return;
    }

    if (this.roomService.roomExists(roomId)) {
      client.emit('error', { message: 'Room already exists' });
      this.logger.warn(
        `Client ${client.id} tried to create an existing room ${roomId}`,
      );
      return;
    }

    this.roomService.createRoom(roomId);
    client.emit('room-created', { roomId });
    this.logger.log(`Room ${roomId} created by client ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { roomId: string }) {
    const { roomId } = data;

    if (!this.roomService.roomExists(roomId)) {
      client.emit('error', { message: 'Room does not exist' });
      return;
    }

    if (client.data.roomId) {
      this.handleLeaveRoom(client, { roomId: client.data.roomId });
    }

    client.data.roomId = roomId;
    const nickname = client.data.nickname || 'Anonymous';

    this.roomService.addClientToRoom(roomId, client.id);
    client.join(roomId);

    const participants = this.roomService.getRoomClients(roomId);
    this.server.to(roomId).emit('participants-updated', { participants });

    this.server.to(roomId).emit('receiveMessage', {
      type: 'notification',
      message: `${nickname} вошел в комнату.`,
    });
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

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, data: { roomId: string; message: string }) {
    const { roomId, message } = data;

    if (!this.roomService.roomExists(roomId)) {
      client.emit('error', { message: 'Room does not exist' });
      this.logger.warn(
        `Client ${client.id} tried to send a message to non-existent room ${roomId}`,
      );
      return;
    }

    this.server.to(roomId).emit('receiveMessage', {
      sender: client.data.nickname || 'Anonymous',
      message,
    });

    this.logger.log(
      `Client ${client.data.nickname || client.id} sent message to room ${roomId}: ${message}`,
    );
  }
}
