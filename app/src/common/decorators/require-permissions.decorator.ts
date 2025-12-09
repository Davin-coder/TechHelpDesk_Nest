import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from '../../modules/access/application/dto/check-permission.dto';

export const PERMISSIONS_METADATA_KEY = 'permissions:require';

export interface RequirePermissionsMetadata {
    resource: string;
    action: PermissionAction;
}

export const RequirePermissions = ( resource: string, action: PermissionAction ) =>
    SetMetadata<string, RequirePermissionsMetadata>(PERMISSIONS_METADATA_KEY, {
        resource,
        action,
    });