import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebRtcSignalingService } from './webrtc-signaling.service';
import { ConnectedScreensService } from './connected-screens.service';

const ORGANIZATION_UPDATE_EVENT_NAME = 'organizationUpdated';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProjectorChangeNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private webrtcSignalingService: WebRtcSignalingService) { }

  clientIdToScreenId: Map<string, string> = new Map();

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    const organizationId = client.handshake.query.organizationId as string;
    const screenId = client.handshake.query.screenId as string;

    if (!organizationId) {
      client.disconnect(true);
      return;
    }

    if (screenId) {
      console.log('Adding screenId: ', screenId);
      this.clientIdToScreenId.set(client.id, screenId);
    }

    client.join(organizationId);
  }

  handleDisconnect(client: Socket): void {
    const associatedScreenId = this.clientIdToScreenId.get(client.id);

    if (associatedScreenId) {
      console.log('Removing screenId: ', associatedScreenId);
      this.webrtcSignalingService.removeByScreenId(associatedScreenId);
    }
  }

  notifyUpdateOrganization(organizationId: string | number): void {
    this.server?.to(organizationId.toString()).emit(ORGANIZATION_UPDATE_EVENT_NAME);
  }


  notifyWebRtcOffer(organizationId: string, screenId: string, offer: any): void {
    this.server?.to(organizationId).emit('webrtcOffer', { screenId, offer });
  }

  notifyWebRtcAnswer(organizationId: string, screenId: string, answer: any): void {
    this.server?.to(organizationId).emit('webrtcAnswer', { screenId, answer });
  }
}
