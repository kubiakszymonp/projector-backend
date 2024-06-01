import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const ORGANIZATION_UPDATE_EVENT_NAME = 'organizationUpdated';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProjectorChangeNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    const organizationId = client.handshake.query.organizationId as string;

    if (!organizationId) {
      client.disconnect(true);
      return;
    }

    client.join(organizationId);
  }

  handleDisconnect(client: Socket): void {

  }

  notifyOrganization(organizationId: string | number): void {
    this.server?.to(organizationId.toString()).emit(ORGANIZATION_UPDATE_EVENT_NAME);
  }
}
