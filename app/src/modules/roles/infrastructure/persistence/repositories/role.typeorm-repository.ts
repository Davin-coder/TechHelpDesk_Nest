import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleOrmEntity } from '../entities/role.orm-entity';
import { IRoleRepository } from '../../../domain/repositories/role-repository.interface';
import { Role } from '../../../domain/entities/role.entity';
import { RoleName } from '../../../domain/value-objects/role-name.vo';
import { PaginationOptions, PaginatedResult } from '../../../../../common/types/pagination.interface';

@Injectable()
export class RoleTypeOrmRepository implements IRoleRepository {
    constructor(
        @InjectRepository(RoleOrmEntity)
        private readonly ormRepo: Repository<RoleOrmEntity>,
    ) {}

    private toDomain(entity: RoleOrmEntity): Role {
        if (!entity) {
            throw new Error('Cannot map null RoleOrmEntity to domain Role');
        }
        const roleName = RoleName.create(entity.name);
        return Role.create({
            id: entity.id,
            name: roleName,
        });
    }

    private toOrmEntity(role: Role): RoleOrmEntity {
        const entity = new RoleOrmEntity();
        if (role.id !== null && role.id !== undefined) {
            entity.id = role.id;
        }
        entity.name = role.name.value;
        return entity;
    }

    async findById(id: number): Promise<Role | null> {
        const entity = await this.ormRepo.findOne({
            where: { id },
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }

    async findByName(name: RoleName): Promise<Role | null> {
        const entity = await this.ormRepo.findOne({
            where: { name: name.value },
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }

    async findAll( options: PaginationOptions ): Promise<PaginatedResult<Role>> {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;

        const [entities, total] = await this.ormRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'ASC',
            },
        });
        const items = entities.map((entity) => this.toDomain(entity));
        return { items, total, page, limit };
    }

    async create(role: Role): Promise<Role> {
        const entity = this.ormRepo.create({
            name: role.name.value,
        });
        const saved = await this.ormRepo.save(entity);
        return this.toDomain(saved);
    }

    async update(role: Role): Promise<Role> {
        if (role.id === null || role.id === undefined) {
            throw new Error('Cannot update a role without an id');
        }
        const entityToUpdate = await this.ormRepo.preload({
            id: role.id,
            name: role.name.value,
        });
        if (!entityToUpdate) {
            throw new Error(`Role with id ${role.id} not found`);
        }
        const saved = await this.ormRepo.save(entityToUpdate);
        return this.toDomain(saved);
    }

    async deleteById(id: number): Promise<void> {
        await this.ormRepo.delete(id);
    }

    async existsByName(name: RoleName): Promise<boolean> {
        const count = await this.ormRepo.count({
            where: { name: name.value },
        });
        return count > 0;
    }
}