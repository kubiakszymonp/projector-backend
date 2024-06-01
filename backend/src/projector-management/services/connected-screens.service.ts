export class ConnectedScreensService {

    public organizationClientsMap = new Map<string, Set<ConnectedClient>>();

    addClient(organizationId: string, screenId: string) {

        if (!this.organizationClientsMap.has(organizationId)) {
            this.organizationClientsMap.set(organizationId, new Set());
        }
        const organizationClients = this.organizationClientsMap.get(organizationId);
        organizationClients.add({ organizationId, screenId });
    }

    removeClient(screenId: string) {
        this.organizationClientsMap.forEach((organizationClients) => {
            organizationClients.forEach((client) => {
                if (client.screenId === screenId) {
                    organizationClients.delete(client);
                }
            });
        });
    }

    getClients(organizationId: string): ConnectedClient[] {
        return Array.from(this.organizationClientsMap.get(organizationId));
    }
}

export interface ConnectedClient {
    organizationId: string;
    screenId?: string;
}