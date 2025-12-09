import { Inject, Injectable } from '@nestjs/common';

import type { IAccessRepository } from '../../domain/repositories/access-repository.interface';
import { ACCESS_REPOSITORY } from '../../domain/repositories/access-repository.interface';

import { CheckPermissionDto, PermissionAction } from '../dto/check-permission.dto';
import { ResourceName } from '../../domain/value-objects/resource-name.vo';

@Injectable()
export class CheckPermissionUseCase {
    constructor(
        @Inject(ACCESS_REPOSITORY)
        private readonly accessRepository: IAccessRepository,
    ) {}

    async execute(input: CheckPermissionDto): Promise<boolean> {
        const resourceName = ResourceName.create(input.resource);
        const permission =
            await this.accessRepository.findByRoleIdAndResource(
                input.roleId,
                resourceName,
            );
        if (!permission) {
            return false;
        }
        return this.checkAction(permission, input.action);
    }
    private checkAction(
        permission: {
            hasReadPermission: () => boolean;
            hasCreatePermission: () => boolean;
            hasUpdatePermission: () => boolean;
            hasDeletePermission: () => boolean;
        },
        action: PermissionAction,
    ): boolean {
        switch (action) {
            case 'read':
                return permission.hasReadPermission();
            case 'create':
                return permission.hasCreatePermission();
            case 'update':
                return permission.hasUpdatePermission();
            case 'delete':
                return permission.hasDeletePermission();
            default:
                return false;
        }
    }
}