import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';
import { GetCurrentUserUseCase } from '../../../application/use-cases/get-current-user.use-case';

import { LoginRequestDto, RefreshTokenRequestDto, AuthTokensResponseDto, CurrentUserResponseDto, AuthUserInfoResponseDto } from '../dto/';

import { LoginDto } from '../../../application/dto/login.dto';
import { RefreshTokenDto } from '../../../application/dto/refresh-token.dto';

import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { CurrentUser } from '../../security/decorators/current-user.decorator';
import type { AuthUser } from '../../../../../common/types/auth-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Autenticar usuario y obtener tokens JWT' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AuthTokensResponseDto,
    })
    async login( @Body() body: LoginRequestDto ): Promise<AuthTokensResponseDto> {
        const dto: LoginDto = {
            usernameOrEmail: body.usernameOrEmail,
            password: body.password,
        };
        const result = await this.loginUseCase.execute(dto);
        return this.toAuthTokensResponseDto(result);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refrescar tokens usando un refresh token válido',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AuthTokensResponseDto,
    })
    async refresh( @Body() body: RefreshTokenRequestDto ): Promise<AuthTokensResponseDto> {
        const dto: RefreshTokenDto = {
            refreshToken: body.refreshToken,
        };
        const result = await this.refreshTokenUseCase.execute(dto);
        return this.toAuthTokensResponseDto(result);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Obtener información del usuario autenticado',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CurrentUserResponseDto,
    })
    async getMe( @CurrentUser() user: AuthUser ): Promise<CurrentUserResponseDto> {
        const result = await this.getCurrentUserUseCase.execute(user.id);
        return {
            id: result.id,
            username: result.username,
            email: result.email,
            roleId: result.roleId,
            roleName: result.roleName,
            isActive: result.isActive,
            createdAt: result.createdAt,
        };
    }

    private toAuthTokensResponseDto(
        result: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresIn: number;
            refreshTokenExpiresIn: number;
            user: {
                id: number;
                username: string;
                email: string;
                roleId: number;
                roleName?: string;
                isActive: boolean;
            };
        },
    ): AuthTokensResponseDto {
        const dto = new AuthTokensResponseDto();
        dto.accessToken = result.accessToken;
        dto.refreshToken = result.refreshToken;
        dto.accessTokenExpiresIn = result.accessTokenExpiresIn;
        dto.refreshTokenExpiresIn = result.refreshTokenExpiresIn;

        const userDto = new AuthUserInfoResponseDto();
        userDto.id = result.user.id;
        userDto.username = result.user.username;
        userDto.email = result.user.email;
        userDto.roleId = result.user.roleId;
        userDto.roleName = result.user.roleName;
        userDto.isActive = result.user.isActive;

        dto.user = userDto;
        return dto;
    }
}
