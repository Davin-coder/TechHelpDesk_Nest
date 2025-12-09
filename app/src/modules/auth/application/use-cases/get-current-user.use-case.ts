import { Inject, Injectable } from '@nestjs/common';

import type { IUserRepository } from 'src/modules/users/domain/repositories/user-repository.interface';
import type { IRoleRepository } from 'src/modules/roles/domain/repositories/role-repository.interface';
import { USER_REPOSITORY } from 'src/modules/users/domain/repositories/user-repository.interface';
import { ROLE_REPOSITORY } from 'src/modules/roles/domain/repositories/role-repository.interface';

import { CurrentUserOutputDto } from '../dto/current-user-output.dto';

@Injectable()
export class GetCurrentUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}

    async execute(userId: number): Promise<CurrentUserOutputDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        const role = await this.roleRepository.findById(user.roleId);
        return {
            id: user.id!,
            username: user.username.value,
            email: user.email.value,
            roleId: user.roleId,
            roleName: role?.name as unknown as string,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
    }
}