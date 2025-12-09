import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { PASSWORD_HASHER } from '../../../../common/security/password-hasher.interface';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import type { IPasswordHasher } from '../../../../common/security/password-hasher.interface';

import { ChangePasswordDto } from '../dto/change-password.dto';
import { PasswordHash } from '../../domain/value-objects/password-hash.vo';

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,
    ) {}

    async execute( userId: number, input: ChangePasswordDto ): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        if (input.currentPassword) {
            const matches = await this.passwordHasher.compare(
                input.currentPassword,
                user.passwordHash.value,
            );
            if (!matches) {
                throw new Error('Current password is incorrect');
            }
        }
        const newHashString = await this.passwordHasher.hash(
            input.newPassword,
        );
        const newPasswordHash = PasswordHash.create(newHashString);
        await this.userRepository.updatePasswordHash(
            userId,
            newPasswordHash,
        );
    }
}