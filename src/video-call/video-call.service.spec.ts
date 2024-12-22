import { Test, TestingModule } from '@nestjs/testing';
import * as mediasoup from 'mediasoup';
import { VideoCallService } from './video-call.service';

jest.mock('mediasoup');

describe('VideoCallService', () => {
  let service: VideoCallService;
  let mockWorker: jest.Mocked<mediasoup.types.Worker>;

  beforeEach(async () => {
    mockWorker = {
      createRouter: jest.fn().mockResolvedValue({
        id: 'test-router',
      }),
    } as unknown as jest.Mocked<mediasoup.types.Worker>;

    (mediasoup.createWorker as jest.Mock).mockResolvedValue(mockWorker);

    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCallService],
    }).compile();

    service = module.get<VideoCallService>(VideoCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init', () => {
    it('should initialize a worker', async () => {
      await service.init();
      expect(mediasoup.createWorker).toHaveBeenCalled();
      expect(mockWorker.createRouter).not.toHaveBeenCalled();
    });
  });

  describe('createRouter', () => {
    beforeEach(async () => {
      await service.init();
    });

    it('should create a new router for a new room', async () => {
      const roomId = 'room123';
      const router = await service.createRouter(roomId);

      expect(mockWorker.createRouter).toHaveBeenCalledWith({
        mediaCodecs: [
          {
            kind: 'audio',
            mimeType: 'audio/opus',
            clockRate: 48000,
            channels: 2,
          },
          { kind: 'video', mimeType: 'video/vp8', clockRate: 90000 },
        ],
      });
      expect(router).toBeDefined();
    });

    it('should return an existing router if the room already exists', async () => {
      const roomId = 'room123';
      const firstRouter = await service.createRouter(roomId);
      const secondRouter = await service.createRouter(roomId);

      expect(firstRouter).toBe(secondRouter); // Один и тот же объект возвращается
      expect(mockWorker.createRouter).toHaveBeenCalledTimes(1);
    });
  });
});
