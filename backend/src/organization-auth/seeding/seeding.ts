import { Role } from "../enums/role.enum";
import { OrganizationsService } from "../services/organizations.service";
import { UsersService } from "../services/users.service";

export const seedUsers = async (usersService: UsersService) => {

    const nonAdminUser = await usersService.createUser({
        email: "kubiakszymon@gmail.com",
        name: "Szymon",
        organizationId: 1,
        password: "password",
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

export const seedOrganizations = async (organizationsService: OrganizationsService) => {
    const organization = await organizationsService.createOrganization({
        contactData: "Ostrów Wielkopolski, Konopnickiej 18/9",
        paymentData: "Płatność gotówką",
        phoneNumber: "123456789",
        name: "Test organization",
    });
};