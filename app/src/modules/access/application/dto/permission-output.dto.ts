export class PermissionOutputDto {
    id!: number;
    roleId!: number;
    resource!: string;
    canRead!: boolean;
    canCreate!: boolean;
    canUpdate!: boolean;
    canDelete!: boolean;
}