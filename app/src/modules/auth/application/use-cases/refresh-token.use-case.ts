import { Inject, Injectable } from '@nestjs/common';

import type { IUserRepository } from 'src/modules/users/domain/repositories/user-repository.interface';
import type { IRoleRepository } from 'src/modules/roles/domain/repositories/role-repository.interface';
import type { ITokenService } from '../../domain/interfaces/token-service.interface';

import { USER_REPOSITORY } from '../../../users/domain/repositories/user-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';
import { TOKEN_SERVICE } from '../../domain/interfaces/token-service.interface';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthTokensOutputDto } from '../dto/auth-tokens-output.dto';

import { JwtPayload } from '../../domain/value-objects/jwt-payload.vo';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.vo';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,

        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
    ) { }

    async execute( input: RefreshTokenDto ): Promise<AuthTokensOutputDto> {
        if (!input.refreshToken || input.refreshToken.trim().length === 0) {
            throw new Error('Refresh token is required');
        }
        const payload = await this.tokenService.verifyRefreshToken(
            input.refreshToken.trim(),
        );
        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new Error('User not found for this token');
        }
        if (!user.isActive) {
            throw new Error('User is not active');
        }
        const newPayload = JwtPayload.create({
            sub: user.id!,
            roleId: user.roleId,
            isActive: user.isActive,
            username: user.username.value,
            email: user.email.value,
        });
        const tokens: AuthTokens = await this.tokenService.generateAuthTokens(newPayload);
        const role = await this.roleRepository.findById(user.roleId);

        return this.toOutputDto(tokens, {
            id: user.id!,
            username: user.username.value,
            email: user.email.value,
            roleId: user.roleId,
            roleName: role?.name as unknown as string,
            isActive: user.isActive,
        });
    }

    private toOutputDto(
        tokens: AuthTokens,
        user: {
            id: number;
            username: string;
            email: string;
            roleId: number;
            roleName?: string;
            isActive: boolean;
        },
    ): AuthTokensOutputDto {
        const plainTokens = tokens.toPlain();

        return {
            accessToken: plainTokens.accessToken,
            refreshToken: plainTokens.refreshToken,
            accessTokenExpiresIn: plainTokens.accessTokenExpiresIn,
            refreshTokenExpiresIn: plainTokens.refreshTokenExpiresIn,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roleId: user.roleId,
                roleName: user.roleName,
                isActive: user.isActive,
            },
        };
    }
}
