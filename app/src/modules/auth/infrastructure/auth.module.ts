import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from '../../users/infrastructure/users.module';
import { RolesModule } from '../../roles/infrastructure/roles.module';

import { LoginUseCase, RefreshTokenUseCase, GetCurrentUserUseCase } from '../application/use-cases/';

import { TOKEN_SERVICE } from '../domain/interfaces/token-service.interface';
import { JwtTokenService } from './security/jwt-token.service';

import { JwtAuthGuard } from './security/guards/jwt-auth.guard';

import { AuthController } from './http/controllers/auth.controller';

import { PASSWORD_HASHER } from '../../../common/security/password-hasher.interface';
import { BcryptPasswordHasher as BcryptPasswordHasherService } from '../../../common/security/bcrypt-password-hasher.service';

@Module({
    imports: [
        UsersModule,
        RolesModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const accessTokenSecret = configService.get<string>('JWT_SECRET');
                if (!accessTokenSecret) {
                    throw new Error('JWT_SECRET env var is required');
                }
                return {
                    secret: accessTokenSecret,
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') ?? '900s',
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        JwtTokenService,
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenService,
        },
        LoginUseCase,
        RefreshTokenUseCase,
        GetCurrentUserUseCase,
        JwtAuthGuard,
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenService,
        },
        {
            provide: PASSWORD_HASHER,
            useClass: BcryptPasswordHasherService,
        },
    ],
    exports: [
        TOKEN_SERVICE,
        JwtAuthGuard,
    ],
})
export class AuthModule { }