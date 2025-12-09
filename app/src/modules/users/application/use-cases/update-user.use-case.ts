import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import type { IRoleRepository } from '../../../roles/domain/repositories/role-repository.interface';

import { Username, UserEmail } from '../../domain/value-objects/';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto, UserOutputDto } from '../dto/';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {}
    async execute( id: number, input: UpdateUserDto ): Promise<UserOutputDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        if (input.username !== undefined) {
            const newUsername = Username.create(input.username);
            if (!user.username.equals(newUsername)) {
                const exists = await this.userRepository.existsByUsername(
                    newUsername,
                );
                if (exists) {
                    throw new Error(
                        `Username "${newUsername.value}" is already in use`,
                    );
                }
                user.changeUsername(newUsername);
            }
        }
        if (input.email !== undefined) {
            const newEmail = UserEmail.create(input.email);
            if (!user.email.equals(newEmail)) {
                const exists = await this.userRepository.existsByEmail(
                    newEmail,
                );
                if (exists) {
                    throw new Error(
                        `Email "${newEmail.value}" is already in use`,
                    );
                }
                user.changeEmail(newEmail);
            }
        }
        if (input.roleId !== undefined) {
            const role = await this.roleRepository.findById(input.roleId);
            if (!role) {
                throw new Error(`Role with id ${input.roleId} not found`);
            }
            user.changeRole(input.roleId);
        }
        if (input.isActive !== undefined) {
            if (input.isActive) {
                user.activate();
            } else {
                user.deactivate();
            }
        }
        const updated = await this.userRepository.update(user);
        return this.toOutputDto(updated);
    }

    private toOutputDto(user: User): UserOutputDto {
        if (user.id == null) {
            throw new Error('Persisted user must have an id');
        }
        return {
            id: user.id,
            username: user.username.value,
            email: user.email.value,
            roleId: user.roleId,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
}