import { Inject, Injectable } from '@nestjs/common';

import type { IRoleRepository } from '../../domain/repositories/role-repository.interface';
import { ROLE_REPOSITORY } from '../../domain/repositories/role-repository.interface';

@Injectable()
export class DeleteRoleUseCase {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute(id: number): Promise<void> {
        const role = await this.roleRepository.findById(id);
        if (!role) { throw new Error(`Role with id ${id} not found`); }
        await this.roleRepository.deleteById(id);
    }
}