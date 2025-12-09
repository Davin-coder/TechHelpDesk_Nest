import { Inject, Injectable } from '@nestjs/common';

import type { IRoleRepository } from '../../domain/repositories/role-repository.interface';
import { ROLE_REPOSITORY } from '../../domain/repositories/role-repository.interface';
import { Role } from '../../domain/entities/role.entity';
import { RoleOutputDto } from '../dto/role-output.dto';

@Injectable()
export class FindOneRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute(id: number): Promise<RoleOutputDto> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new Error(`Role with id ${id} not found`);
        }
        return this.toOutputDto(role);
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