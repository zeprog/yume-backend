import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';

@Injectable()
export class VideoCallService {
  private worker: mediasoup.types.Worker;
  private routers: Map<string, mediasoup.types.Router> = new Map();

  async init() {
    this.worker = await mediasoup.createWorker({
      logLevel: 'debug',
      rtcMinPort: 10000,
      rtcMaxPort: 20000,
    });
  }

  async createRouter(roomId: string): Promise<mediasoup.types.Router> {
    if (!this.routers.has(roomId)) {
      const router = await this.worker.createRouter({
        mediaCodecs: [
          { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },
          { kind: 'video', mimeType: 'video/vp8', clockRate: 90000 },
        ],
      });
      this.routers.set(roomId, router);
    }
    return this.routers.get(roomId)!;
  }
}