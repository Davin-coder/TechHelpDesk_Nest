import { Inject, Injectable } from '@nestjs/common';

import type { IAccessRepository } from '../../domain/repositories/access-repository.interface';
import type { IRoleRepository } from '../../../roles/domain/repositories/role-repository.interface';
import { ACCESS_REPOSITORY } from '../../domain/repositories/access-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';

import { ResourceName } from '../../domain/value-objects/resource-name.vo';
import { AccessPermission } from '../../domain/entities/access-permission.entity';
import { PermissionOutputDto } from '../dto/permission-output.dto';

@Injectable()
export class GetRolePermissionForResourceUseCase {
    constructor(
        @Inject(ACCESS_REPOSITORY)
        private readonly accessRepository: IAccessRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute(params: { roleId: number; resource: string; }): Promise<PermissionOutputDto | null> {
        const role = await this.roleRepository.findById(params.roleId);
        if (!role) {
            throw new Error(`Role with id ${params.roleId} not found`);
        }
        const resourceName = ResourceName.create(params.resource);
        const permission =
            await this.accessRepository.findByRoleIdAndResource(
                params.roleId,
                resourceName,
            );
        if (!permission) {
            return null;
        }
        return this.toOutputDto(permission);
    }
    private toOutputDto( permission: AccessPermission ): PermissionOutputDto {
        if (permission.id == null) {
            throw new Error('Persisted permission must have an id');
        }
        return {
            id: permission.id,
            roleId: permission.roleId,
            resource: permission.resource.value,
            canRead: permission.canRead,
            canCreate: permission.canCreate,
            canUpdate: permission.canUpdate,
            canDelete: permission.canDelete,
        };
    }
}