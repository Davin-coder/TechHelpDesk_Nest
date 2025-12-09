import { ResourcePermissionDto } from './resource-permission.dto';

export class AssignPermissionsDto {
    roleId!: number;
    permissions!: ResourcePermissionDto[];
}