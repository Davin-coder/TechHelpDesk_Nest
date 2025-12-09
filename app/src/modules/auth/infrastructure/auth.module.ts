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

@Module({
    imports: [
        UsersModule,
        RolesModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const jwtCfg = configService.get<{
                    accessTokenSecret: string;
                    accessTokenExpiresIn: number;
                }>('jwt');
                if (!jwtCfg?.accessTokenSecret) {
                    throw new Error(
                        'jwt.accessTokenSecret config is required for JwtModule',
                    );
                }
                return {
                    secret: jwtCfg.accessTokenSecret,
                    signOptions: {
                        expiresIn: jwtCfg.accessTokenExpiresIn ?? 900,
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
    ],
    exports: [
        TOKEN_SERVICE,
        JwtAuthGuard,
    ],
})
export class AuthModule { }