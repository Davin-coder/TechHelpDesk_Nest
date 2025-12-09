import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../../users/domain/repositories/user-repository.interface';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role-repository.interface';
import { PASSWORD_HASHER } from '../../../../common/security/password-hasher.interface';
import { TOKEN_SERVICE } from '../../domain/interfaces/token-service.interface';

import type { IUserRepository } from 'src/modules/users/domain/repositories/user-repository.interface';
import type { IRoleRepository } from 'src/modules/roles/domain/repositories/role-repository.interface';
import type { IPasswordHasher } from 'src/common/security/password-hasher.interface';
import type { ITokenService } from '../../domain/interfaces/token-service.interface';

import { LoginDto } from '../dto/login.dto';
import { AuthTokensOutputDto } from '../dto/auth-tokens-output.dto';

import { JwtPayload } from '../../domain/value-objects/jwt-payload.vo';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.vo';

import { Username, UserEmail } from '../../../users/domain/value-objects';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,

        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,

        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: IPasswordHasher,

        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
    ) {}

    async execute(input: LoginDto): Promise<AuthTokensOutputDto> {
        const identifier = input.usernameOrEmail.trim();
        if (!identifier || !input.password) {
            throw new Error('Invalid credentials');
        }
        const user = await this.findUserByIdentifier(identifier);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (!user.isActive) {
            throw new Error('User is not active');
        }
        const passwordMatches = await this.passwordHasher.compare(
            input.password,
            user.passwordHash.value,
        );
        if (!passwordMatches) {
            throw new Error('Invalid credentials');
        }
        const payload = JwtPayload.create({
            sub: user.id!,
            roleId: user.roleId,
            isActive: user.isActive,
            username: user.username.value,
            email: user.email.value,
        });
        const tokens: AuthTokens = await this.tokenService.generateAuthTokens(
            payload,
        );
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

    private async findUserByIdentifier(identifier: string) {
        const looksLikeEmail = identifier.includes('@');
        if (looksLikeEmail) {
            const email = UserEmail.create(identifier);
            return this.userRepository.findByEmail(email);
        }
        const username = Username.create(identifier);
        return this.userRepository.findByUsername(username);
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
