import { Inject, Injectable } from '@nestjs/common';

import type { IRoleRepository } from '../../domain/repositories/role-repository.interface';
import { ROLE_REPOSITORY } from '../../domain/repositories/role-repository.interface';
import { Role } from '../../domain/entities/role.entity';
import { PaginationOptions, PaginatedResult } from '../../../../common/types/pagination.interface';
import { RoleOutputDto } from '../dto/role-output.dto';

@Injectable()
export class FindAllRolesUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute( options: PaginationOptions ): Promise<PaginatedResult<RoleOutputDto>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        
        const result = await this.roleRepository.findAll({
            page,
            limit,
        });
        return {
            items: result.items.map((role) => this.toOutputDto(role)),
            total: result.total,
            page: result.page,
            limit: result.limit,
        };
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