import { Test, TestingModule } from '@nestjs/testing';
import { VideoCallModule } from './video-call.module';
import { VideoCallGateway } from './video-call.gateway';
import { VideoCallService } from './video-call.service';

describe('VideoCallModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [VideoCallModule],
    }).compile();
  });

  it('should be defined', () => {
    const videoCallModule = module.get<VideoCallModule>(VideoCallModule);
    expect(videoCallModule).toBeDefined();
  });

  it('should provide VideoCallGateway', () => {
    const videoCallGateway = module.get<VideoCallGateway>(VideoCallGateway);
    expect(videoCallGateway).toBeDefined();
    expect(videoCallGateway).toBeInstanceOf(VideoCallGateway);
  });

  it('should provide VideoCallService', () => {
    const videoCallService = module.get<VideoCallService>(VideoCallService);
    expect(videoCallService).toBeDefined();
    expect(videoCallService).toBeInstanceOf(VideoCallService);
  });
});
