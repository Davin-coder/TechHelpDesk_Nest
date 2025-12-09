export class CurrentUserOutputDto {
    id!: number;
    username!: string;
    email!: string;
    roleId!: number;
    roleName?: string;
    isActive!: boolean;
    createdAt!: Date;
}