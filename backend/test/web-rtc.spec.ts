import { Test } from "@nestjs/testing";
import { QueueTextUnitService } from "../src/text-unit-resources/services/queue-text-unit.service";
import { TEST_TIMEOUT, testDbConfig } from "../src/text-unit-resources/tests/test-db.config";
import { WebRtcSignalingService } from "../src/projector-management/services/webrtc-signaling.service";
import { ProjectorChangeNotificationGateway } from "../src/projector-management/services/projector-change-notification.gateway";

describe("QueueTextUnitTest", () => {
    let webRtcSignalingService: WebRtcSignalingService;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [WebRtcSignalingService, ProjectorChangeNotificationGateway],
        }).compile();

        webRtcSignalingService = module.get(WebRtcSignalingService);
    }, TEST_TIMEOUT);

    it("should be defined", () => {
        expect(webRtcSignalingService).toBeDefined();
    });

    it("should create entry inside organization connections", async () => {
        const organizationId = "1";
        webRtcSignalingService.setWaitingScreen(organizationId, "1");
        const state = webRtcSignalingService.getState(organizationId);

        expect(state).toBeDefined();
        expect(state.length).toBe(1);

        const val = Array.from(state.values())[0]
        expect(val.screenId).toBe("1");
    }, TEST_TIMEOUT);

    it("should create two screen entries and add offer and answer to one", () => {
        const organizationId = "1";
        webRtcSignalingService.setWaitingScreen(organizationId, "1");
        webRtcSignalingService.setWaitingScreen(organizationId, "2");


        const state = webRtcSignalingService.getState(organizationId);
        expect(state).toBeDefined();
        expect(state.length).toBe(2);

        webRtcSignalingService.setOffer(organizationId, {
            payload: "something",
            screenId: "1"
        });

        const state2 = webRtcSignalingService.getState(organizationId);
        const screen1Data = state2.find(value => value.screenId === "1");
        const screen2Data = state2.find(value => value.screenId === "2");

        expect(screen1Data.offer).not.toBeNull();
        expect(screen2Data.offer).toBeNull();
    });

    it("should exchange webrtc information between two screens and remove", () => {

        const organizationId = "1";
        webRtcSignalingService.setWaitingScreen(organizationId, "1");
        webRtcSignalingService.setWaitingScreen(organizationId, "2");

        webRtcSignalingService.setOffer(organizationId, {
            payload: "something",
            screenId: "1"
        });

        webRtcSignalingService.setAnswer(organizationId, {
            payload: "something2",
            screenId: "1"
        });

        const state = webRtcSignalingService.getState(organizationId);
        const screen1Data = Array.from(state).find(value => value.screenId === "1");

        expect(screen1Data.answer).not.toBeNull();

        webRtcSignalingService.removeScreen(organizationId, "1");
        const state2 = webRtcSignalingService.getState(organizationId);

        expect(state2.length).toBe(1);
        expect(state2.find(value => value.screenId === "1")).toBeUndefined();
    });
});
