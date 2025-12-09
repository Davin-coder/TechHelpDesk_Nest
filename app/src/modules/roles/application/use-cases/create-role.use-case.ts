import { Inject, Injectable } from '@nestjs/common';

import type { IRoleRepository } from '../../domain/repositories/role-repository.interface';
import { ROLE_REPOSITORY } from '../../domain/repositories/role-repository.interface';
import { RoleName } from '../../domain/value-objects/role-name.vo';
import { Role } from '../../domain/entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleOutputDto } from '../dto/role-output.dto';

@Injectable()
export class CreateRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute(input: CreateRoleDto): Promise<RoleOutputDto> {
        const roleName = RoleName.create(input.name);
        const existing = await this.roleRepository.findByName(roleName);
        if (existing) {
            throw new Error( `Role with name "${roleName.value}" already exists`);
        }
        const role = Role.create({ name: roleName });
        const saved = await this.roleRepository.create(role);
        
        return this.toOutputDto(saved);
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