import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule], // Подключаем RoomModule для зависимостей
  providers: [WebsocketService, WebsocketGateway],
  exports: [WebsocketService], // Экспортируем WebsocketService
})
export class WebSocketModule {}