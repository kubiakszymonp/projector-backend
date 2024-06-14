import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ENVIRONMENT } from "src/environment";
import { Repository } from "typeorm";
import { CreateOrganizationDto } from "../dto/create-organization.dto";
import { UpdateOrganizationDto } from "../dto/update-organization.dto";
import { Organization } from "../entities/organization.entity";

@Injectable()
export class OrganizationsService {

    constructor(
        @InjectRepository(Organization) private organizationRepository: Repository<Organization>,
    ) {
    }

    async createOrganization(createOrganizationDto: CreateOrganizationDto) {
        const createdOrganization = this.organizationRepository.create(createOrganizationDto);
        return await this.organizationRepository.save(createdOrganization);
    }
    async updateOrganization(updateOrganizationDto: UpdateOrganizationDto) {
        const updatedOrganization = await this.organizationRepository.findOne({ where: { id: updateOrganizationDto.id } });
        if (!updatedOrganization) {
            throw new UnauthorizedException('Organization not found');
        }

        return await this.organizationRepository.save(updateOrganizationDto);
    }

    async getOrganizations() {
        return await this.organizationRepository.find();
    }

    async getOrganization(id: string) {
        return await this.organizationRepository.findOne({ where: { id } });
    }

    async deleteOrganization(id: string) {
        return await this.organizationRepository.delete({ id });
    }

    async seedOrganiation(uuid: string) {
        const org = await this.organizationRepository.save({
            id: uuid,
            name: 'Initial org data',
            description: 'Initial org data',
            phoneNumber: 'Initial org data',
            paymentData: 'Initial org data',
            contactData: 'Initial org data',
        });

        console.log('Seeded organization', org);
        return org;
    }
}
