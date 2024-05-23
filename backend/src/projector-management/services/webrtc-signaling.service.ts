import { Injectable } from "@nestjs/common";
import { WebRtcConnectionStructure } from "../structures/webrtc-connection-structure";

@Injectable()
export class WebRtcSignalingService {

    private organizationConnections: Map<string, any> = new Map<string, any>();

    constructor() {
    }

    setOffer(organizationId: string, offer: any): WebRtcConnectionStructure {

        this.organizationConnections.set(organizationId, {
            sdpOffer: offer,
            sdpAnswer: null,
        });

        return this.organizationConnections.get(organizationId);
    }

    getState(organizationId: string): any {
        return this.organizationConnections.get(organizationId);
    }

    setAnswer(organizationId: string, answer: any) {
        const connection = this.organizationConnections.get(organizationId);
        connection.sdpAnswer = answer;
        this.organizationConnections.set(organizationId, connection);
    }

    private generateRandomString(): string {
        return Math.random().toString(36).substring(2, 15) + new Date().getTime().toString(36);
    }
}