import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller'; // Импорт контроллера

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService], // Экспортируем RoomService
})
export class RoomModule {}
