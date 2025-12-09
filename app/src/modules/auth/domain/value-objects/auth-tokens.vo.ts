export interface AuthTokensProps {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}

export class AuthTokens {
    private constructor(private readonly props: AuthTokensProps) { }
    static create(props: AuthTokensProps): AuthTokens {
        if (!props.accessToken || props.accessToken.trim().length === 0) {
            throw new Error('accessToken is required');
        }
        if (!props.refreshToken || props.refreshToken.trim().length === 0) {
            throw new Error('refreshToken is required');
        }
        if (props.accessTokenExpiresIn <= 0) {
            throw new Error(
                'accessTokenExpiresIn must be a positive number (seconds)',
            );
        }
        if (props.refreshTokenExpiresIn <= 0) {
            throw new Error(
                'refreshTokenExpiresIn must be a positive number (seconds)',
            );
        }
        return new AuthTokens({
            accessToken: props.accessToken.trim(),
            refreshToken: props.refreshToken.trim(),
            accessTokenExpiresIn: props.accessTokenExpiresIn,
            refreshTokenExpiresIn: props.refreshTokenExpiresIn,
        });
    }
    get accessToken(): string {
        return this.props.accessToken;
    }
    get refreshToken(): string {
        return this.props.refreshToken;
    }
    get accessTokenExpiresIn(): number {
        return this.props.accessTokenExpiresIn;
    }
    get refreshTokenExpiresIn(): number {
        return this.props.refreshTokenExpiresIn;
    }
    toPlain(): AuthTokensProps {
        return { ...this.props };
    }
}