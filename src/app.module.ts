import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { WebSocketModule } from './websocket/websocket.module';
import { VideoCallModule } from './video-call/video-call.module';

@Module({
  imports: [RoomModule, WebSocketModule, VideoCallModule],
})
export class AppModule {}