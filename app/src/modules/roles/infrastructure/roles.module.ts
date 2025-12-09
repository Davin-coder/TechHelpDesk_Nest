import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleOrmEntity } from './persistence/entities/role.orm-entity';
import { RoleTypeOrmRepository } from './persistence/repositories/role.typeorm-repository';

import {
    ROLE_REPOSITORY,
} from '../domain/repositories/role-repository.interface';

import { CreateRoleUseCase } from '../application/use-cases/create-role.use-case';
import { FindAllRolesUseCase } from '../application/use-cases/find-all-roles.use-case';
import { FindOneRoleUseCase } from '../application/use-cases/find-one-role.use-case';
import { UpdateRoleUseCase } from '../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../application/use-cases/delete-role.use-case';

import { RolesController } from './http/controllers/roles.controller';
import { AccessModule } from '../../access/infrastructure/access.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleOrmEntity]),
        // Para poder usar PermissionsGuard exportado por AccessModule
        forwardRef(() => AccessModule),
    ],
    controllers: [RolesController],
    providers: [
        RoleTypeOrmRepository,
        {
            provide: ROLE_REPOSITORY,
            useClass: RoleTypeOrmRepository,
        },

        CreateRoleUseCase,
        FindAllRolesUseCase,
        FindOneRoleUseCase,
        UpdateRoleUseCase,
        DeleteRoleUseCase,
    ],
    exports: [
        ROLE_REPOSITORY,
        FindOneRoleUseCase,
        FindAllRolesUseCase,
    ],
})
export class RolesModule { }
