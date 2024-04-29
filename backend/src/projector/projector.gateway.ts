import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, {
  cors: {
    origin: '*',
  },
})
export class ProjectorGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clientMap = new Map<string, Set<string>>(); // To track clients by organization

  handleConnection(client: Socket): void {
    const orgId = client.handshake.query.organizationId as string;
    
    if (!orgId) {
      client.disconnect(true);
      return;
    }

    if (!this.clientMap.has(orgId)) {
      this.clientMap.set(orgId, new Set());
    }
    this.clientMap.get(orgId)!.add(client.id);
    client.join(orgId); // using rooms for organization-based broadcasts
  }

  handleDisconnect(client: Socket): void {
    this.clientMap.forEach((clients, orgId) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.clientMap.delete(orgId);
      }
    });
  }

  emitChangeEvent(orgId: string): void {
    this.server.to(orgId).emit("changed");
  }
}
