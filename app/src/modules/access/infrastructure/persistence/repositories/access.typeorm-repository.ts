import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccessOrmEntity } from '../entities/access.orm-entity';

import { IAccessRepository } from '../../../domain/repositories/access-repository.interface';
import { AccessPermission } from '../../../domain/entities/access-permission.entity';
import { ResourceName } from '../../../domain/value-objects/resource-name.vo';

@Injectable()
export class AccessTypeOrmRepository implements IAccessRepository {
    constructor(
        @InjectRepository(AccessOrmEntity)
        private readonly ormRepo: Repository<AccessOrmEntity>,
    ) {}
    private toDomain(entity: AccessOrmEntity): AccessPermission {
        if (!entity) {
            throw new Error('Cannot map null AccessOrmEntity to domain');
        }
        const roleId = entity.role?.id;
        if (!roleId) {
            throw new Error('AccessOrmEntity is missing role relation');
        }
        const resource = ResourceName.create(entity.resource);
        return AccessPermission.create({
            id: entity.id,
            roleId,
            resource,
            canRead: entity.canRead,
            canCreate: entity.canCreate,
            canUpdate: entity.canUpdate,
            canDelete: entity.canDelete,
        });
    }
    private toOrmEntity(permission: AccessPermission): AccessOrmEntity {
        const entity = new AccessOrmEntity();
        if (permission.id !== null && permission.id !== undefined) {
            entity.id = permission.id;
        }
        entity.role = { id: permission.roleId } as any;
        entity.resource = permission.resource.value;
        entity.canRead = permission.canRead;
        entity.canCreate = permission.canCreate;
        entity.canUpdate = permission.canUpdate;
        entity.canDelete = permission.canDelete;
        return entity;
    }
    async findById(id: number): Promise<AccessPermission | null> {
        const entity = await this.ormRepo.findOne({
            where: { id },
            relations: ['role'],
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }
    async findByRoleId(roleId: number): Promise<AccessPermission[]> {
        const entities = await this.ormRepo.find({
            where: { role: { id: roleId } },
            relations: ['role'],
            order: {
                resource: 'ASC',
            },
        });
        return entities.map((e) => this.toDomain(e));
    }

    async findByRoleIdAndResource( roleId: number, resource: ResourceName ): Promise<AccessPermission | null> {
        const entity = await this.ormRepo.findOne({
            where: {
                role: { id: roleId },
                resource: resource.value,
            },
            relations: ['role'],
        });
        if (!entity) {
            return null;
        }
        return this.toDomain(entity);
    }

    async create( permission: AccessPermission ): Promise<AccessPermission> {
        const entity = this.toOrmEntity(permission);
        const saved = await this.ormRepo.save(entity);
        const reloaded = await this.ormRepo.findOne({
            where: { id: saved.id },
            relations: ['role'],
        });
        if (!reloaded) {
            throw new Error('Failed to reload access permission after save');
        }
        return this.toDomain(reloaded);
    }

    async update( permission: AccessPermission ): Promise<AccessPermission> {
        if (permission.id === null || permission.id === undefined) {
            throw new Error('Cannot update a permission without an id');
        }
        const entityToUpdate = await this.ormRepo.preload({
            id: permission.id,
            role: { id: permission.roleId } as any,
            resource: permission.resource.value,
            canRead: permission.canRead,
            canCreate: permission.canCreate,
            canUpdate: permission.canUpdate,
            canDelete: permission.canDelete,
        });
        if (!entityToUpdate) {
            throw new Error(
                `Access permission with id ${permission.id} not found`,
            );
        }
        const saved = await this.ormRepo.save(entityToUpdate);
        const reloaded = await this.ormRepo.findOne({
            where: { id: saved.id },
            relations: ['role'],
        });
        if (!reloaded) {
            throw new Error('Failed to reload access permission after update');
        }
        return this.toDomain(reloaded);
    }

    async deleteById(id: number): Promise<void> {
        await this.ormRepo.delete(id);
    }

    async deleteByRoleIdAndResource( roleId: number, resource: ResourceName ): Promise<void> {
        await this.ormRepo.delete({
            role: { id: roleId },
            resource: resource.value,
        } as any);
    }

    async deleteAllForRole(roleId: number): Promise<void> {
        await this.ormRepo.delete({
            role: { id: roleId },
        } as any);
    }
}