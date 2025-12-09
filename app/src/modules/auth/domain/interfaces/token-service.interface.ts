import { JwtPayload } from '../value-objects/jwt-payload.vo';
import { AuthTokens } from '../value-objects/auth-tokens.vo';

export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export interface ITokenService {
    signAccessToken(payload: JwtPayload): Promise<string>;

    signRefreshToken(payload: JwtPayload): Promise<string>;

    generateAuthTokens(payload: JwtPayload): Promise<AuthTokens>;

    verifyAccessToken(token: string): Promise<JwtPayload>;

    verifyRefreshToken(token: string): Promise<JwtPayload>;
}
