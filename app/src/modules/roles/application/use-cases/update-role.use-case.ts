import { Inject, Injectable } from '@nestjs/common';

import type { IRoleRepository } from '../../domain/repositories/role-repository.interface';
import { ROLE_REPOSITORY } from '../../domain/repositories/role-repository.interface';
import { Role } from '../../domain/entities/role.entity';
import { RoleName } from '../../domain/value-objects/role-name.vo';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleOutputDto } from '../dto/role-output.dto';

@Injectable()
export class UpdateRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute( id: number, input: UpdateRoleDto ): Promise<RoleOutputDto> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new Error(`Role with id ${id} not found`);
        }
        if (input.name !== undefined) {
            const newName = RoleName.create(input.name);
            
            if (!role.name.equals(newName)) {
                const existsWithNewName =
                    await this.roleRepository.existsByName(newName);
                    
                if (existsWithNewName) {
                    throw new Error(
                        `Role with name "${newName.value}" already exists`,
                    );
                }
                role.changeName(newName);
            }
        }
        const updated = await this.roleRepository.update(role);
        return this.toOutputDto(updated);
    }
    private toOutputDto(role: Role): RoleOutputDto {
        if (role.id == null) {
            throw new Error('Persisted role must have an id');
        }
        return {
            id: role.id,
            name: role.name.value,
        };
    }
}