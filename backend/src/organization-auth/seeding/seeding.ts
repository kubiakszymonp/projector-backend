import { Role } from "../enums/role.enum";
import { OrganizationAuthService } from "../organization-auth.service";

export const seedUsers = async (organizationAuthService: OrganizationAuthService) => {

    const nonAdminUser = await organizationAuthService.createUser({
        email: "kubiakszymon@gmail.com",
        name: "Szymon",
        organizationId: 1,
        password: "password",
        role: Role.USER,
    });

    const adminUser = await organizationAuthService.createUser({
        email: "test@admin.com",
        name: "Admin",
        organizationId: null,
        password: "test",
        role: Role.ADMIN,
    });
};

export const seedOrganizations = async (organizationAuthService: OrganizationAuthService) => {
    const organization = await organizationAuthService.createOrganization({
        contactData: "Ostrów Wielkopolski, Konopnickiej 18/9",
        paymentData: "Płatność gotówką",
        phoneNumber: "123456789",
        name: "Test organization",
    });
};