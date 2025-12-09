export type PermissionAction = 'read' | 'create' | 'update' | 'delete';

export class CheckPermissionDto {
    roleId!: number;
    resource!: string;
    action!: PermissionAction;
}