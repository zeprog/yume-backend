import { Test, TestingModule } from '@nestjs/testing';
import { VideoCallGateway } from './video-call.gateway';
import { WebsocketService } from '../websocket/websocket.service';
import { RoomService } from '../room/room.service';

describe('VideoCallGateway', () => {
  let gateway: VideoCallGateway;
  let websocketService: WebsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoCallGateway,
        {
          provide: WebsocketService,
          useValue: {
            broadcastToRoom: jest.fn(),
          },
        },
        {
          provide: RoomService,
          useValue: {},
        },
      ],
    }).compile();

    gateway = module.get<VideoCallGateway>(VideoCallGateway);
    websocketService = module.get<WebsocketService>(WebsocketService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleOffer', () => {
    it('should broadcast offer to the room', () => {
      const data = { roomId: 'room1', offer: { sdp: 'test-offer' } };
      gateway.handleOffer(data);

      expect(websocketService.broadcastToRoom).toHaveBeenCalledWith(
        'room1',
        'offer',
        { offer: data.offer },
      );
    });
  });

  describe('handleAnswer', () => {
    it('should broadcast answer to the room', () => {
      const data = { roomId: 'room1', answer: { sdp: 'test-answer' } };
      gateway.handleAnswer(data);

      expect(websocketService.broadcastToRoom).toHaveBeenCalledWith(
        'room1',
        'answer',
        { answer: data.answer },
      );
    });
  });

  describe('handleCandidate', () => {
    it('should broadcast candidate to the room', () => {
      const data = { roomId: 'room1', candidate: { candidate: 'test-candidate' } };
      gateway.handleCandidate(data);

      expect(websocketService.broadcastToRoom).toHaveBeenCalledWith(
        'room1',
        'candidate',
        { candidate: data.candidate },
      );
    });
  });
});
