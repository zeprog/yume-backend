import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({
    description: 'ID комнаты, к которой подключается пользователь',
    example: 'room123',
  })
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
