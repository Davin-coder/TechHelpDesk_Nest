import { Body, Controller, DefaultValuePipe,Get, HttpCode,
    HttpStatus, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserUseCase, FindAllUsersUseCase, FindOneUserUseCase, 
    UpdateUserUseCase, ChangePasswordUseCase, ActivateUserUseCase, DeactivateUserUseCase } from '../../../application/use-cases/';

import { CreateUserRequestDto, UpdateUserRequestDto, ChangePasswordRequestDto, UserResponseDto } from '../dto/';

import { PaginatedResult } from '../../../../../common/types/pagination.interface';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../../../common/decorators/require-permissions.decorator';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findAllUsersUseCase: FindAllUsersUseCase,
        private readonly findOneUserUseCase: FindOneUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly activateUserUseCase: ActivateUserUseCase,
        private readonly deactivateUserUseCase: DeactivateUserUseCase,
    ) {}

    @Post()
    @RequirePermissions('users', 'create')
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: UserResponseDto,
    })
    async create(
        @Body() body: CreateUserRequestDto,
    ): Promise<UserResponseDto> {
        const result = await this.createUserUseCase.execute({
            username: body.username,
            email: body.email,
            password: body.password,
            roleId: body.roleId,
            isActive: body.isActive,
        });

        return this.toResponseDto(result);
    }

    @Get()
    @RequirePermissions('users', 'read')
    @ApiOperation({
        summary: 'Listar usuarios con paginación y filtros',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Pages numbers (1-based)',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Quantity of elements per page',
        example: 10,
    })
    @ApiQuery({
        name: 'isActive',
        required: false,
        description: 'Filter by actives and deactives',
        example: true,
    })
    @ApiQuery({
        name: 'roleId',
        required: false,
        description: 'Filter by id_role',
        example: 2,
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'get by username or email',
        example: 'john',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        isArray: true,
    })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
        @Query('isActive', new DefaultValuePipe(undefined), ParseBoolPipe)
        isActive?: boolean,
        @Query('roleId', new DefaultValuePipe(undefined), ParseIntPipe)
        roleId?: number,
        @Query('search') search?: string,
    ): Promise<PaginatedResult<UserResponseDto>> {
        const result = await this.findAllUsersUseCase.execute({
            page,
            limit,
            isActive,
            roleId,
            search,
        });

        return {
            ...result,
            items: result.items.map((user) => this.toResponseDto(user)),
        };
    }

    @Get(':id')
    @RequirePermissions('users', 'read')
    @ApiOperation({ summary: 'Get a user by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserResponseDto> {
        const result = await this.findOneUserUseCase.execute(id);
        return this.toResponseDto(result);
    }

    @Patch(':id')
    @RequirePermissions('users', 'update')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserRequestDto,
    ): Promise<UserResponseDto> {
        const result = await this.updateUserUseCase.execute(id, {
            username: body.username,
            email: body.email,
            roleId: body.roleId,
            isActive: body.isActive,
        });

        return this.toResponseDto(result);
    }

    @Patch(':id/change-password')
    @RequirePermissions('users', 'update')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Update password of user',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Password updated successful',
    })
    async changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChangePasswordRequestDto,
    ): Promise<void> {
        await this.changePasswordUseCase.execute(id, {
            currentPassword: body.currentPassword,
            newPassword: body.newPassword,
        });
    }

    @Patch(':id/activate')
    @RequirePermissions('users', 'update')
    @ApiOperation({ summary: 'Active user' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
    })
    async activate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserResponseDto> {
        const result = await this.activateUserUseCase.execute(id);
        return this.toResponseDto(result);
    }

    @Patch(':id/deactivate')
    @RequirePermissions('users', 'update')
    @ApiOperation({ summary: 'Desactive userS' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
    })
    async deactivate(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserResponseDto> {
        const result = await this.deactivateUserUseCase.execute(id);
        return this.toResponseDto(result);
    }

    private toResponseDto(user: {
        id: number;
        username: string;
        email: string;
        roleId: number;
        isActive: boolean;
        createdAt: Date;
    }): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = user.id;
        dto.username = user.username;
        dto.email = user.email;
        dto.roleId = user.roleId;
        dto.isActive = user.isActive;
        dto.createdAt = user.createdAt;
        return dto;
    }
}