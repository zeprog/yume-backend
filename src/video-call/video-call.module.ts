import { Module } from '@nestjs/common';
import { VideoCallGateway } from './video-call.gateway';
import { VideoCallService } from './video-call.service';
import { WebSocketModule } from '../websocket/websocket.module'; // Импорт WebSocketModule
import { RoomModule } from '../room/room.module';

@Module({
  imports: [WebSocketModule, RoomModule], // Импортируем WebSocketModule и RoomModule
  providers: [VideoCallGateway, VideoCallService],
})
export class VideoCallModule {}