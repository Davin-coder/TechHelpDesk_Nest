import { Inject, Injectable } from '@nestjs/common';

import type { IAccessRepository } from '../../domain/repositories/access-repository.interface';
import type { IRoleRepository } from '../../../roles/domain/repositories/role-repository.interface';
import { ACCESS_REPOSITORY } from '../../domain/repositories/access-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';

import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { PermissionOutputDto } from '../dto/permission-output.dto';

import { ResourceName } from '../../domain/value-objects/resource-name.vo';
import { AccessPermission } from '../../domain/entities/access-permission.entity';

@Injectable()
export class AssignPermissionsToRoleUseCase {
    constructor(
        @Inject(ACCESS_REPOSITORY)
        private readonly accessRepository: IAccessRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute( input: AssignPermissionsDto ): Promise<PermissionOutputDto[]> {
        const role = await this.roleRepository.findById(input.roleId);
        if (!role) {
            throw new Error(`Role with id ${input.roleId} not found`);
        }
        const existingPermissions = await this.accessRepository.findByRoleId(input.roleId);

        const existingByResource = new Map<string, AccessPermission>();
        for (const perm of existingPermissions) {
            existingByResource.set(perm.resource.value, perm);
        }
        const incomingByResource = new Map<
            string,
            {
                resource: ResourceName;
                canRead: boolean;
                canCreate: boolean;
                canUpdate: boolean;
                canDelete: boolean;
            }
        >();
        for (const permDto of input.permissions) {
            const resource = ResourceName.create(permDto.resource);
            incomingByResource.set(resource.value, {
                resource,
                canRead: permDto.canRead ?? false,
                canCreate: permDto.canCreate ?? false,
                canUpdate: permDto.canUpdate ?? false,
                canDelete: permDto.canDelete ?? false,
            });
        }
        const resultPermissions: AccessPermission[] = [];
        for (const [resourceKey, entry] of incomingByResource.entries()) {
            const existing = existingByResource.get(resourceKey);
            if (existing) {
                existing.updatePermissions({
                    canRead: entry.canRead,
                    canCreate: entry.canCreate,
                    canUpdate: entry.canUpdate,
                    canDelete: entry.canDelete,
                });
                const updated = await this.accessRepository.update(existing);
                resultPermissions.push(updated);
            } else {
                const newPermission = AccessPermission.create({
                    roleId: input.roleId,
                    resource: entry.resource,
                    canRead: entry.canRead,
                    canCreate: entry.canCreate,
                    canUpdate: entry.canUpdate,
                    canDelete: entry.canDelete,
                });
                const created = await this.accessRepository.create(newPermission);
                resultPermissions.push(created);
            }
        }
        for (const [resourceKey, existing] of existingByResource.entries()) {
            if (!incomingByResource.has(resourceKey)) {
                if (existing.id != null) {
                    await this.accessRepository.deleteById(existing.id);
                }
            }
        }
        return resultPermissions
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