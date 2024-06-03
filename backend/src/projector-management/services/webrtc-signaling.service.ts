import { Injectable } from "@nestjs/common";
import { WebRtcConnectionStructure } from "../structures/webrtc-connection-structure";
import { WebRtcSdpDto } from "../dto/get/webrtc-sdp.dto";
import { ProjectorChangeNotificationGateway } from "./projector-change-notification.gateway";

@Injectable()
export class WebRtcSignalingService {

    organizationConnections: Map<string, Set<WebRtcConnectionStructure>> = new Map();

    constructor() {
    }

    // removeByScreenId(screenId: string): void {
    //     this.organizationConnections.forEach((connections) => {
    //         connections.forEach((connection) => {
    //             if (connection.screenId === screenId) {
    //                 connections.delete(connection);
    //             }
    //         });
    //     });
    // }

    // setWaitingScreen(organizationId: string, screenId: string): WebRtcConnectionStructure {

    //     if (!this.organizationConnections.has(organizationId)) {
    //         this.organizationConnections.set(organizationId, new Set());
    //     }
    //     this.organizationConnections.get(organizationId).add({
    //         offer: null,
    //         answer: null,
    //         screenId: screenId,
    //     });
    //     return this.getForOrganzationAndScreen(organizationId, screenId);
    // }

    // getForOrganzationAndScreen(organizationId: string, screenId: string): WebRtcConnectionStructure {
    //     const connections = this.organizationConnections.get(organizationId);
    //     for (const connection of connections) {
    //         if (connection.screenId === screenId) {
    //             return connection;
    //         }
    //     }
    //     return null;
    // }

    // setOffer(organizationId: string, offer: WebRtcSdpDto): Set<WebRtcConnectionStructure> {

    //     const connection = this.getForOrganzationAndScreen(organizationId, offer.screenId);

    //     if (!connection) {
    //         console.log("No connection found for screenId: ", offer.screenId, " organizationId: ", organizationId);
    //         return;
    //     }

    //     connection.offer = offer.payload;

    //     return this.organizationConnections.get(organizationId);
    // }


    // getState(organizationId: string): Array<WebRtcConnectionStructure> {
    //     return Array.from(this.organizationConnections.get(organizationId) ?? []);
    // }

    // setAnswer(organizationId: string, answer: WebRtcSdpDto): Set<WebRtcConnectionStructure> {

    //     const connection = this.getForOrganzationAndScreen(organizationId, answer.screenId);

    //     if (!connection) {
    //         console.log("No connection found for screenId: ", answer.screenId, " organizationId: ", organizationId);
    //         return;
    //     }

    //     connection.answer = answer.payload;

    //     return this.organizationConnections.get(organizationId);
    // }

    // removeScreen(organizationId: string, screenId: string): Set<WebRtcConnectionStructure> {
    //     const organizationConnections = this.organizationConnections.get(organizationId);
    //     organizationConnections.forEach((connection) => {
    //         if (connection.screenId === screenId) {
    //             organizationConnections.delete(connection);
    //         }
    //     });

    //     return this.organizationConnections.get(organizationId);
    // }

    // clearOrganization(organizationId: string) {
    //     const connectionsForOrganizations = this.organizationConnections.get(organizationId);
    //     connectionsForOrganizations?.forEach(rtc => {
    //         rtc.answer = null
    //         rtc.offer = null
    //     });
    // }


    private generateRandomString(): string {
        return Math.random().toString(36).substring(2, 15) + new Date().getTime().toString(36);
    }
}