import { Inject, Injectable } from '@nestjs/common';

import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserOutputDto } from '../dto/user-output.dto';

@Injectable()
export class FindOneUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    async execute(id: number): Promise<UserOutputDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return this.toOutputDto(user);
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