import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserOutputDto } from '../dto/user-output.dto';

@Injectable()
export class DeactivateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    async execute(id: number): Promise<UserOutputDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        user.deactivate();
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