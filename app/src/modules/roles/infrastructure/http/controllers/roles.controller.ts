import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, 
    HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

import { CreateRoleUseCase, FindAllRolesUseCase, FindOneRoleUseCase, UpdateRoleUseCase, DeleteRoleUseCase } from '../../../application/use-cases/';

import { CreateRoleRequestDto, UpdateRoleRequestDto, RoleResponseDto } from '../dto/';

import { PaginatedResult } from '../../../../../common/types/pagination.interface';
import { PermissionsGuard } from '../../../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../../../common/decorators/require-permissions.decorator';

@ApiTags('roles')
@ApiBearerAuth('JWT-auth')
@UseGuards(PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(
        private readonly createRoleUseCase: CreateRoleUseCase,
        private readonly findAllRolesUseCase: FindAllRolesUseCase,
        private readonly findOneRoleUseCase: FindOneRoleUseCase,
        private readonly updateRoleUseCase: UpdateRoleUseCase,
        private readonly deleteRoleUseCase: DeleteRoleUseCase,
    ) {}

    @Post()
    @RequirePermissions('roles', 'create')
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: RoleResponseDto,
    })
    async create(
        @Body() body: CreateRoleRequestDto,
    ): Promise<RoleResponseDto> {
        const result = await this.createRoleUseCase.execute({
            name: body.name,
        });

        return this.toResponseDto(result);
    }

    @Get()
    @RequirePermissions('roles', 'read')
    @ApiOperation({ summary: 'Roles list by pagination' })
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
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List paginated for roles',
        type: RoleResponseDto,
        isArray: true,
    })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
    ): Promise<PaginatedResult<RoleResponseDto>> {
        const result = await this.findAllRolesUseCase.execute({
            page,
            limit,
        });

        return {
            ...result,
            items: result.items.map((item) => this.toResponseDto(item)),
        };
    }

    @Get(':id')
    @RequirePermissions('roles', 'read')
    @ApiOperation({ summary: 'Get a role by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RoleResponseDto,
    })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<RoleResponseDto> {
        const result = await this.findOneRoleUseCase.execute(id);
        return this.toResponseDto(result);
    }

    @Patch(':id')
    @RequirePermissions('roles', 'update')
    @ApiOperation({ summary: 'Update an existing role' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: RoleResponseDto,
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateRoleRequestDto,
    ): Promise<RoleResponseDto> {
        const result = await this.updateRoleUseCase.execute(id, {
            name: body.name,
        });

        return this.toResponseDto(result);
    }

    @Delete(':id')
    @RequirePermissions('roles', 'delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a role by id' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Role deleted successful',
    })
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.deleteRoleUseCase.execute(id);
    }

    private toResponseDto(
        role: { id: number; name: string },
    ): RoleResponseDto {
        const dto = new RoleResponseDto();
        dto.id = role.id;
        dto.name = role.name;
        return dto;
    }
}