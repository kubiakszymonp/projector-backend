import { ENVIRONMENT } from "src/environment";
import { Role } from "../enums/role.enum";
import { OrganizationsService } from "../services/organizations.service";
import { UsersService } from "../services/users.service";

export const seedData = async (usersService: UsersService, organizationsService: OrganizationsService) => {

    const organization = await organizationsService.createOrganization({
        contactData: "Ostrów Wielkopolski, Konopnickiej 18/9",
        paymentData: "Płatność gotówką",
        phoneNumber: "123456789",
        name: "Test organization",
    });

    const nonAdminUser = await usersService.createUser({
        email: ENVIRONMENT.ROOT_USER_EMAIL,
        name: "Szymon",
        organizationId: organization.id,
        password: ENVIRONMENT.ROOT_USER_PASSWORD,
        role: Role.USER,
    });

    const adminUser = await usersService.createUser({
        email: "test@admin.com",
        name: "Admin",
        organizationId: null,
        password: "test",
        role: Role.ADMIN,
    });
};
