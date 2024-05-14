import { Injectable } from '@nestjs/common';
import { ProjectorGateway } from './projector.gateway';

@Injectable()
export class ProjectorLastUpdateService {
  private organizationProjectorLastUpdates: OrganizationProjectorLastUpdate[] =
    [];

  constructor(private projectorGateway: ProjectorGateway) {}

  public setLastUpdate(organizationId: number | string) {
    const entry = this.findByOrganizationId(organizationId);

    if (entry) {
      entry.lastUpdateTime = new Date().getTime();
    } else {
      this.setLastUpdateForOrganization(organizationId);
    }
    this.projectorGateway.emitChangeEvent(String(organizationId));
  }

  public getLastUpdate(organizationId: number | string) {
    const entry = this.findByOrganizationId(organizationId);

    if (!entry) {
      this.setLastUpdateForOrganization(organizationId);
    }

    return this.findByOrganizationId(organizationId).lastUpdateTime;
  }

  private setLastUpdateForOrganization(organizationId: number | string) {
    const orgString = String(organizationId);
    const id = parseInt(orgString, 10);
    this.organizationProjectorLastUpdates.push({
      organizationId: id,
      lastUpdateTime: new Date().getTime(),
    });
  }

  private findByOrganizationId(organizationId: number | string) {
    const orgString = String(organizationId);
    const id = parseInt(orgString, 10);
    return this.organizationProjectorLastUpdates.find(
      (e) => e.organizationId === id,
    );
  }
}

export interface OrganizationProjectorLastUpdate {
  organizationId: number;
  lastUpdateTime: number;
}