import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';
import { PASSWORD_HASHER } from '../../../../common/security/password-hasher.interface';

import type { IPasswordHasher } from '../../../../common/security/password-hasher.interface';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import type { IRoleRepository } from '../../../roles/domain/repositories/role-repository.interface';

import { CreateUserDto, UserOutputDto } from '../dto/';

import { Username, UserEmail, PasswordHash } from '../../domain/value-objects/';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,

        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
    ) { }

    async execute(input: CreateUserDto): Promise<UserOutputDto> {
        const username = Username.create(input.username);
        const email = UserEmail.create(input.email);
        const usernameExists =
            await this.userRepository.existsByUsername(username);
        if (usernameExists) {
            throw new Error(
                `Username "${username.value}" is already in use`,
            );
        }
        const emailExists = await this.userRepository.existsByEmail(email);
        if (emailExists) {
            throw new Error(`Email "${email.value}" is already in use`);
        }
        const role = await this.roleRepository.findById(input.roleId);
        if (!role) {
            throw new Error(`Role with id ${input.roleId} not found`);
        }
        const hash = await this.passwordHasher.hash(input.password);
        const passwordHash = PasswordHash.create(hash);

        const user = User.create({
            username,
            email,
            passwordHash,
            roleId: input.roleId,
            isActive: input.isActive ?? true,
        });
        const saved = await this.userRepository.create(user);
        return this.toOutputDto(saved);
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