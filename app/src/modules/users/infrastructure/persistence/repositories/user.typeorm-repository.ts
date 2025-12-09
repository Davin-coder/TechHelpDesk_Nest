import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptions, PaginatedResult } from '../../../../../common/types/pagination.interface';

import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { IUserRepository, UserListFilters } from '../../../domain/repositories/user-repository.interface';

import { PasswordHash, Username, UserEmail } from '../../../domain/value-objects/';

import { RoleOrmEntity } from '../../../../roles/infrastructure/persistence/entities/role.orm-entity';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepo: Repository<UserOrmEntity>,
    ) {}
    private toDomain(entity: UserOrmEntity): User {
        if (!entity) {
            throw new Error('Cannot map null UserOrmEntity to domain User');
        }
        const username = Username.create(entity.username);
        const email = UserEmail.create(entity.email);
        const passwordHash = PasswordHash.create(entity.passwordHash);
        const roleId = entity.role?.id;
        if (!roleId) {
            throw new Error('UserOrmEntity is missing role relation');
        }
        return User.create({
            id: entity.id,
            username,
            email,
            passwordHash,
            roleId,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
        });
    }
    private toOrmEntity(user: User): UserOrmEntity {
        const entity = new UserOrmEntity();
        if (user.id !== null && user.id !== undefined) {
            entity.id = user.id;
        }
        entity.username = user.username.value;
        entity.email = user.email.value;
        entity.passwordHash = user.passwordHash.value;
        entity.role = { id: user.roleId } as RoleOrmEntity;
        entity.isActive = user.isActive;
        entity.createdAt = user.createdAt;
        return entity;
    }

    async findById(id: number): Promise<User | null> {
        const entity = await this.ormRepo.findOne({
            where: { id },
            relations: ['role'],
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }

    async findByUsername(username: Username): Promise<User | null> {
        const entity = await this.ormRepo.findOne({
            where: { username: username.value },
            relations: ['role'],
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }

    async findByEmail(email: UserEmail): Promise<User | null> {
        const entity = await this.ormRepo.findOne({
            where: { email: email.value },
            relations: ['role'],
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }

    async findAll( options: PaginationOptions, filters?: UserListFilters ): Promise<PaginatedResult<User>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit =
            options.limit && options.limit > 0 ? options.limit : 10;

        const qb = this.ormRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .orderBy('user.id', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);

        if (filters?.isActive !== undefined) {
            qb.andWhere('user.isActive = :isActive', {
                isActive: filters.isActive,
            });
        }
        if (filters?.roleId !== undefined) {
            qb.andWhere('role.id = :roleId', { roleId: filters.roleId });
        }
        if (filters?.search && filters.search.trim().length > 0) {
            const search = `%${filters.search.toLowerCase()}%`;
            qb.andWhere(
                '(LOWER(user.username) LIKE :search OR LOWER(user.email) LIKE :search)',
                { search },
            );
        }
        const [entities, total] = await qb.getManyAndCount();
        const items = entities.map((e) => this.toDomain(e));
        return { items, total, page, limit };
    }

    async create(user: User): Promise<User> {
        const entity = this.toOrmEntity(user);
        const saved = await this.ormRepo.save(entity);
        const reloaded = await this.ormRepo.findOne({
            where: { id: saved.id },
            relations: ['role'],
        });
        if (!reloaded) {
            throw new Error('Failed to reload user after save');
        }
        return this.toDomain(reloaded);
    }

    async update(user: User): Promise<User> {
        if (user.id === null || user.id === undefined) {
            throw new Error('Cannot update a user without an id');
        }
        const entityToUpdate = await this.ormRepo.preload({
            id: user.id,
            username: user.username.value,
            email: user.email.value,
            passwordHash: user.passwordHash.value,
            role: { id: user.roleId } as RoleOrmEntity,
            isActive: user.isActive,
            createdAt: user.createdAt,
        });
        if (!entityToUpdate) {
            throw new Error(`User with id ${user.id} not found`);
        }
        const saved = await this.ormRepo.save(entityToUpdate);
        const reloaded = await this.ormRepo.findOne({
            where: { id: saved.id },
            relations: ['role'],
        });
        if (!reloaded) {
            throw new Error('Failed to reload user after update');
        }
        return this.toDomain(reloaded);
    }

    async deleteById(id: number): Promise<void> {
        await this.ormRepo.delete(id);
    }

    async existsByUsername(username: Username): Promise<boolean> {
        const count = await this.ormRepo.count({
            where: { username: username.value },
        });
        return count > 0;
    }

    async existsByEmail(email: UserEmail): Promise<boolean> {
        const count = await this.ormRepo.count({
            where: { email: email.value },
        });
        return count > 0;
    }

    async updatePasswordHash( userId: number, passwordHash: PasswordHash ): Promise<void> {
        await this.ormRepo.update(userId, {
            passwordHash: passwordHash.value,
        });
    }
}