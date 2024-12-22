import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private rooms: Map<string, Set<string>> = new Map();

  createRoom(roomId: string) {
    if (this.rooms.has(roomId)) {
      throw new Error('Room already exists');
    }
    this.rooms.set(roomId, new Set());
  }

  addClientToRoom(roomId: string, clientId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.add(clientId);
    } else {
      throw new Error('Room not found');
    }
  }

  removeClientFromRoom(roomId: string, clientId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomId); // Удаляем комнату, если она пуста
      }
    } else {
      throw new Error('Room not found');
    }
  }

  getRoomClients(roomId: string): string[] {
    return Array.from(this.rooms.get(roomId) || []);
  }

  deleteRoom(roomId: string) {
    if (this.rooms.has(roomId)) {
      this.rooms.delete(roomId);
    } else {
      throw new Error('Room not found');
    }
  }
}