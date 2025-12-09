import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserOrmEntity } from './persistence/entities/user.orm-entity';
import { UserTypeOrmRepository } from './persistence/repositories/user.typeorm-repository';

import {
    USER_REPOSITORY,
} from '../domain/repositories/user-repository.interface';

import { PASSWORD_HASHER } from '../../../common/security/password-hasher.interface';
import { BcryptPasswordHasher } from '../../../common/security/bcrypt-password-hasher.service';

import { RolesModule } from '../../roles/infrastructure/roles.module';
import { AccessModule } from '../../access/infrastructure/access.module';

import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../application/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from '../application/use-cases/find-one-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { ActivateUserUseCase } from '../application/use-cases/activate-user.use-case';
import { DeactivateUserUseCase } from '../application/use-cases/deactivate-user.use-case';

import { UsersController } from './http/controllers/users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity]),
        RolesModule,
        AccessModule, // 👈 para usar PermissionsGuard
    ],
    controllers: [UsersController],
    providers: [
        UserTypeOrmRepository,
        {
            provide: USER_REPOSITORY,
            useClass: UserTypeOrmRepository,
        },

        BcryptPasswordHasher,
        {
            provide: PASSWORD_HASHER,
            useClass: BcryptPasswordHasher,
        },

        CreateUserUseCase,
        FindAllUsersUseCase,
        FindOneUserUseCase,
        UpdateUserUseCase,
        ChangePasswordUseCase,
        ActivateUserUseCase,
        DeactivateUserUseCase,
    ],
    exports: [
        USER_REPOSITORY,
        FindOneUserUseCase,
        FindAllUsersUseCase,
    ],
})
export class UsersModule { }