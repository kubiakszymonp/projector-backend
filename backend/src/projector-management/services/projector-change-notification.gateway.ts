import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebRtcSignalingService } from './webrtc-signaling.service';
import { ConnectedScreensService } from './connected-screens.service';

const ORGANIZATION_UPDATE_EVENT_NAME = 'organizationUpdated';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class ProjectorChangeNotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private webrtcSignalingService: WebRtcSignalingService) { }

  connectedClients: ConnectedClient[] = [];

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    const organizationId = client.handshake.query.organizationId as string;
    const role = client.handshake.query.role as Role;

    if (!organizationId) {
      client.disconnect(true);
      return;
    }


    this.connectedClients.push({ clientId: client.id, organizationId, role });
    console.log('Client connected: ', client.id, organizationId, role);

    client.join(organizationId);
  }

  handleDisconnect(client: Socket): void {
    const clientData = this.connectedClients.find((c) => c.clientId === client.id);
    if (!clientData) {
      return;
    }

    console.log('Client disconnected: ', client.id, clientData.organizationId);

    this.connectedClients = this.connectedClients.filter((c) => c.clientId !== client.id);
  }

  notifyUpdateOrganization(organizationId: string | number): void {
    this.server?.to(organizationId.toString()).emit(ORGANIZATION_UPDATE_EVENT_NAME);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, payload: { offer: any, clientId: string }) {
    console.log(`Offer recieved from ${client.id}, sending to ${payload.clientId}`)
    this.server.to(payload.clientId).emit('offer', payload.offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, answer: any) {
    const clientData = this.connectedClients.find((c) => c.clientId === client.id);
    if (!clientData) {
      return;
    }

    const senderClients = this.connectedClients.filter((c) => c.organizationId === clientData.organizationId && c.role === Role.SENDER);
    const senderClient = senderClients[senderClients.length - 1];
    if (!senderClient) {
      return;
    }

    console.log(`Answer recieved from ${client.id}, sending to ${senderClient.clientId}`);
    this.server.to(senderClient.clientId).emit('answer', { answer: answer, clientId: client.id });
  }

  @SubscribeMessage('get-state')
  handleGetState(client: Socket, payload: any) {
    const clientData = this.connectedClients.find((c) => c.clientId === client.id);
    if (!clientData) {
      return;
    }

    console.log(`Get state request from ${client.id} about ${clientData.organizationId} organization`)

    const recieverClients = this.connectedClients.filter((c) => c.organizationId === clientData.organizationId && c.role === Role.RECIEVER);

    client.emit("get-state", recieverClients);
  }
}


export interface ConnectedClient {
  clientId: string;
  organizationId: string;
  role: string;
}

export enum Role {
  SENDER = 'SENDER',
  RECIEVER = 'RECIEVER'
}