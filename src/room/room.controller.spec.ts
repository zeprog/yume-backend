import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { JoinRoomDto } from './dto/join-room.dto';

describe('RoomController', () => {
  let controller: RoomController;
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: {
            addClientToRoom: jest.fn(), // Мокируем метод
          },
        },
      ],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('joinRoom', () => {
    it('should call RoomService.addClientToRoom with correct parameters', () => {
      const roomId = 'room123';
      const joinRoomDto: JoinRoomDto = { roomId };

      controller.joinRoom(joinRoomDto);

      expect(service.addClientToRoom).toHaveBeenCalledWith(roomId, 'client123');
    });

    it('should return a success message', () => {
      const roomId = 'room123';
      const joinRoomDto: JoinRoomDto = { roomId };

      const result = controller.joinRoom(joinRoomDto);

      expect(result).toEqual({ message: `Client added to room: ${roomId}` });
    });
  });
});
