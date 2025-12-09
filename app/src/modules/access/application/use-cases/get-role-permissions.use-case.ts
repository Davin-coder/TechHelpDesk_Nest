import { Inject, Injectable } from '@nestjs/common';

import type { IAccessRepository } from '../../domain/repositories/access-repository.interface';
import type { IRoleRepository } from '../../../roles/domain/repositories/role-repository.interface';
import { ACCESS_REPOSITORY } from '../../domain/repositories/access-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';

import { AccessPermission } from '../../domain/entities/access-permission.entity';
import { PermissionOutputDto } from '../dto/permission-output.dto';

@Injectable()
export class GetRolePermissionsUseCase {
    constructor(
        @Inject(ACCESS_REPOSITORY)
        private readonly accessRepository: IAccessRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute(roleId: number): Promise<PermissionOutputDto[]> {
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new Error(`Role with id ${roleId} not found`);
        }
        const permissions = await this.accessRepository.findByRoleId(roleId);
        return permissions
            .sort((a, b) =>
                a.resource.value.localeCompare(b.resource.value),
            )
            .map((p) => this.toOutputDto(p));
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