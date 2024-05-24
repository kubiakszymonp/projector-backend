import { Injectable } from "@nestjs/common";
import { WebRtcConnectionStructure } from "../structures/webrtc-connection-structure";
import { WebRtcSdpDto } from "../dto/get/webrtc-sdp.dto";

@Injectable()
export class WebRtcSignalingService {

    private organizationConnections: Map<string, WebRtcConnectionStructure> = new Map<string, WebRtcConnectionStructure>();

    constructor() {
    }

    setOffer(organizationId: string, offer: WebRtcSdpDto): WebRtcConnectionStructure {

        this.organizationConnections.set(organizationId, {
            offer: offer.payload,
            answer: null,
        });

        return this.organizationConnections.get(organizationId);
    }

    getState(organizationId: string): WebRtcConnectionStructure {
        return this.organizationConnections.get(organizationId);
    }

    setAnswer(organizationId: string, answer: WebRtcSdpDto) {
        const connection = this.organizationConnections.get(organizationId);
        connection.answer = answer.payload;
        this.organizationConnections.set(organizationId, connection);
    }

    private generateRandomString(): string {
        return Math.random().toString(36).substring(2, 15) + new Date().getTime().toString(36);
    }
}