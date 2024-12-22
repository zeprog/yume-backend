import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { JoinRoomDto } from './dto/join-room.dto';

@ApiTags('rooms') // Swagger тег для группировки API
@Controller('rooms') // URL для работы с комнатами
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('join')
  joinRoom(@Body() joinRoomDto: JoinRoomDto) {
    const { roomId } = joinRoomDto;
    this.roomService.addClientToRoom(roomId, 'client123'); // client123 — временный ID клиента
    return { message: `Client added to room: ${roomId}` };
  }
}
