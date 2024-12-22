import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { WebsocketService } from '../websocket/websocket.service';
import { RoomService } from '../room/room.service';

@WebSocketGateway()
export class VideoCallGateway {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: { roomId: string; offer: any }) {
    const { roomId, offer } = data;
    this.websocketService.broadcastToRoom(roomId, 'offer', { offer });
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: { roomId: string; answer: any }) {
    const { roomId, answer } = data;
    this.websocketService.broadcastToRoom(roomId, 'answer', { answer });
  }

  @SubscribeMessage('candidate')
  handleCandidate(@MessageBody() data: { roomId: string; candidate: any }) {
    const { roomId, candidate } = data;
    this.websocketService.broadcastToRoom(roomId, 'candidate', { candidate });
  }
}
