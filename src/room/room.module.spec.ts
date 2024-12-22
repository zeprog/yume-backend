import { Test, TestingModule } from '@nestjs/testing';
import { RoomModule } from './room.module';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

describe('RoomModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [RoomModule],
    }).compile();
  });

  it('should be defined', () => {
    const roomModule = module.get<RoomModule>(RoomModule);
    expect(roomModule).toBeDefined();
  });

  it('should provide RoomService', () => {
    const roomService = module.get<RoomService>(RoomService);
    expect(roomService).toBeDefined();
    expect(roomService).toBeInstanceOf(RoomService);
  });

  it('should include RoomController', () => {
    const controllers = module.get<RoomController[]>(RoomController);
    expect(controllers).toBeDefined();
    expect(controllers).toBeInstanceOf(RoomController);
  });
});
