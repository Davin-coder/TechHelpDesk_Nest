import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY, UserListFilters } from '../../domain/repositories/user-repository.interface';
import { PaginationOptions, PaginatedResult } from '../../../../common/types/pagination.interface';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';

import { User } from '../../domain/entities/user.entity';
import { UserOutputDto } from '../dto/';

@Injectable()
export class FindAllUsersUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    async execute(params: {
        page?: number;
        limit?: number;
        isActive?: boolean;
        roleId?: number;
        search?: string;
    }): Promise<PaginatedResult<UserOutputDto>> {
        const page =
            params.page && params.page > 0 ? params.page : 1;
        const limit =
            params.limit && params.limit > 0 ? params.limit : 10;

        const options: PaginationOptions = { page, limit };
        const filters: UserListFilters = {
            isActive: params.isActive,
            roleId: params.roleId,
            search: params.search,
        };
        const result = await this.userRepository.findAll(
            options,
            filters,
        );
        return {
            items: result.items.map((user) => this.toOutputDto(user)),
            total: result.total,
            page: result.page,
            limit: result.limit,
        };
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