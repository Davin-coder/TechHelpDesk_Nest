import { ApiProperty } from '@nestjs/swagger';
import { AuthUserInfoResponseDto } from './auth-user-info.response.dto';

export class AuthTokensResponseDto {
    @ApiProperty({
        description: 'JWT de acceso',
        example: 'eyJhbGciOiJIUzI1NiIsInR...',
    })
    accessToken!: string;

    @ApiProperty({
        description: 'JWT de refresh',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken!: string;

    @ApiProperty({
        description: 'Tiempo hasta expiración del access token (segundos)',
        example: 900,
    })
    accessTokenExpiresIn!: number;

    @ApiProperty({
        description: 'Tiempo hasta expiración del refresh token (segundos)',
        example: 604800,
    })
    refreshTokenExpiresIn!: number;

    @ApiProperty({
        description: 'Información básica del usuario autenticado',
        type: AuthUserInfoResponseDto,
    })
    user!: AuthUserInfoResponseDto;
}
