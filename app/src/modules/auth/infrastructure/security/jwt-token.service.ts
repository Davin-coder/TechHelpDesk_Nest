import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ITokenService } from '../../domain/interfaces/token-service.interface';
import { JwtPayload } from '../../domain/value-objects/jwt-payload.vo';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.vo';
import { JwtPayloadProps } from '../../domain/value-objects/jwt-payload.vo';

interface JwtConfig {
    accessTokenSecret: string;
    accessTokenExpiresIn: number;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: number;
}

@Injectable()
export class JwtTokenService implements ITokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    private get jwtConfig(): JwtConfig {
        const cfg = this.configService.get<{
            accessTokenSecret: string;
            accessTokenExpiresIn: number;
            refreshTokenSecret: string;
            refreshTokenExpiresIn: number; }>('jwt');
        if (!cfg) {
            throw new Error('JWT configuration (jwt) is missing');
        }
        return {
            accessTokenSecret: cfg.accessTokenSecret,
            accessTokenExpiresIn: cfg.accessTokenExpiresIn,
            refreshTokenSecret: cfg.refreshTokenSecret,
            refreshTokenExpiresIn: cfg.refreshTokenExpiresIn,
        };
    }

    async signAccessToken(payload: JwtPayload): Promise<string> {
        const { accessTokenSecret, accessTokenExpiresIn } = this.jwtConfig;
        return this.jwtService.signAsync(payload.toPlain(), {
            secret: accessTokenSecret,
            expiresIn: accessTokenExpiresIn,
        });
    }

    async signRefreshToken(payload: JwtPayload): Promise<string> {
        const { refreshTokenSecret, refreshTokenExpiresIn } = this.jwtConfig;
        return this.jwtService.signAsync(payload.toPlain(), {
            secret: refreshTokenSecret,
            expiresIn: refreshTokenExpiresIn,
        });
    }

    async generateAuthTokens(payload: JwtPayload): Promise<AuthTokens> {
        const {
            accessTokenExpiresIn,
            refreshTokenExpiresIn,
        } = this.jwtConfig;

        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(payload),
            this.signRefreshToken(payload),
        ]);
        return AuthTokens.create({
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
            refreshTokenExpiresIn,
        });
    }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
        const { accessTokenSecret } = this.jwtConfig;

        const decoded = await this.jwtService.verifyAsync<JwtPayloadProps>(
            token,
            { secret: accessTokenSecret },
        );
        return JwtPayload.create(decoded);
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload> {
        const { refreshTokenSecret } = this.jwtConfig;
        const decoded = await this.jwtService.verifyAsync<JwtPayloadProps>(
            token,
            { secret: refreshTokenSecret },
        );
        return JwtPayload.create(decoded);
    }
}