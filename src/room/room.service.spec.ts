import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should create a room', () => {
    service.createRoom('test-room');
    expect(service.getRoomClients('test-room')).toEqual([]);
  });

  it('should add a client to a room', () => {
    service.createRoom('test-room');
    service.addClientToRoom('test-room', 'client1');
    expect(service.getRoomClients('test-room')).toContain('client1');
  });

  it('should remove a client from a room', () => {
    service.createRoom('test-room');
    service.addClientToRoom('test-room', 'client1');
    service.removeClientFromRoom('test-room', 'client1');
    expect(service.getRoomClients('test-room')).not.toContain('client1');
  });
});
