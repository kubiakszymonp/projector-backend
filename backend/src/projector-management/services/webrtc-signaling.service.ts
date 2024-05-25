import { Injectable } from "@nestjs/common";
import { WebRtcConnectionStructure } from "../structures/webrtc-connection-structure";
import { WebRtcSdpDto } from "../dto/get/webrtc-sdp.dto";
import { ProjectorChangeNotificationGateway } from "./projector-change-notification.gateway";

@Injectable()
export class WebRtcSignalingService {

    private organizationConnections: Map<string, WebRtcConnectionStructure> = new Map<string, WebRtcConnectionStructure>();

    constructor(private projectorChangeNotificationGateway: ProjectorChangeNotificationGateway) {
    }

    setOffer(organizationId: string, offer: WebRtcSdpDto): WebRtcConnectionStructure {

        this.organizationConnections.set(organizationId, {
            offer: offer.payload,
            answer: null,
        });
        this.projectorChangeNotificationGateway.notifyOrganization(organizationId);
        return this.organizationConnections.get(organizationId);
    }

    getState(organizationId: string): WebRtcConnectionStructure {
        return this.organizationConnections.get(organizationId);
    }

    setAnswer(organizationId: string, answer: WebRtcSdpDto) {
        const connection = this.organizationConnections.get(organizationId);
        connection.answer = answer.payload;
        this.organizationConnections.set(organizationId, connection);
        this.projectorChangeNotificationGateway.notifyOrganization(organizationId);
        return this.organizationConnections.get(organizationId);
    }

    private generateRandomString(): string {
        return Math.random().toString(36).substring(2, 15) + new Date().getTime().toString(36);
    }
}