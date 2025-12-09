export class AuthTokensOutputDto {
    accessToken!: string;
    refreshToken!: string;
    accessTokenExpiresIn!: number;
    refreshTokenExpiresIn!: number;
    user!: {
        id: number;
        username: string;
        email: string;
        roleId: number;
        roleName?: string;
        isActive: boolean;
    };
}