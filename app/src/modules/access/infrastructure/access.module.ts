import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessOrmEntity } from './persistence/entities/access.orm-entity';
import { AccessTypeOrmRepository } from './persistence/repositories/access.typeorm-repository';

import { ACCESS_REPOSITORY } from '../domain/repositories/access-repository.interface';

import { RolesModule } from '../../roles/infrastructure/roles.module';

import { AssignPermissionsToRoleUseCase, GetRolePermissionsUseCase, GetRolePermissionForResourceUseCase, CheckPermissionUseCase } from '../application/use-cases/';

import { AccessController } from './http/controllers/access.controller';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccessOrmEntity]),
        forwardRef(() => RolesModule),
    ],
    controllers: [AccessController],
    providers: [
        AccessTypeOrmRepository,
        {
            provide: ACCESS_REPOSITORY,
            useClass: AccessTypeOrmRepository,
        },

        AssignPermissionsToRoleUseCase,
        GetRolePermissionsUseCase,
        GetRolePermissionForResourceUseCase,
        CheckPermissionUseCase,

        PermissionsGuard,
    ],
    exports: [
        ACCESS_REPOSITORY,
        CheckPermissionUseCase,
        PermissionsGuard,
    ],
})
export class AccessModule { }