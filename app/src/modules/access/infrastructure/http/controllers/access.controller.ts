import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';

import { AssignPermissionsToRoleUseCase, GetRolePermissionsUseCase, 
    GetRolePermissionForResourceUseCase, CheckPermissionUseCase } from '../../../application/use-cases/';

import { AssignPermissionsRequestDto, CheckPermissionRequestDto, 
    PermissionResponseDto, RolePermissionsResponseDto } from '../dto/';

import { PermissionOutputDto, CheckPermissionDto } from '../../../application/dto/';

@ApiTags('access')
@ApiBearerAuth('JWT-auth')
@Controller('access')
export class AccessController {
    constructor(
        private readonly assignPermissionsToRoleUseCase: AssignPermissionsToRoleUseCase,
        private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
        private readonly getRolePermissionForResourceUseCase: GetRolePermissionForResourceUseCase,
        private readonly checkPermissionUseCase: CheckPermissionUseCase,
    ) {}
    @Post('assign')
    @ApiOperation({
        summary: 'Asignar o actualizar permisos para un rol',
        description:
            'Reemplaza completamente los permisos actuales de un rol por la lista enviada.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Permisos asignados correctamente',
        type: PermissionResponseDto,
        isArray: true,
    })
    async assignPermissions(
        @Body() body: AssignPermissionsRequestDto,
    ): Promise<PermissionResponseDto[]> {
        const result = await this.assignPermissionsToRoleUseCase.execute({
            roleId: body.roleId,
            permissions: body.permissions.map((p) => ({
                resource: p.resource,
                canRead: p.canRead,
                canCreate: p.canCreate,
                canUpdate: p.canUpdate,
                canDelete: p.canDelete,
            })),
        });
        return result.map((p) => this.toPermissionResponseDto(p));
    }

    @Get('roles/:roleId/permissions')
    @ApiOperation({
        summary: 'Obtener todos los permisos de un rol',
    })
    @ApiParam({
        name: 'roleId',
        description: 'ID del rol',
        example: 1,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de permisos del rol',
        type: RolePermissionsResponseDto,
    })
    async getRolePermissions(
        @Param('roleId', ParseIntPipe) roleId: number,
    ): Promise<RolePermissionsResponseDto> {
        const permissions =
            await this.getRolePermissionsUseCase.execute(roleId);
        return this.toRolePermissionsResponseDto(roleId, permissions);
    }

    @Get('roles/:roleId/permissions/:resource')
    @ApiOperation({
        summary: 'Obtener los permisos de un rol sobre un recurso específico',
    })
    @ApiParam({
        name: 'roleId',
        description: 'ID del rol',
        example: 1,
    })
    @ApiParam({
        name: 'resource',
        description:
            'Nombre del recurso (minúsculas, sin espacios, ej: "users")',
        example: 'users',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            'Permiso del rol sobre el recurso. Si no existe, se interpreta como sin permisos (deny by default).',
        type: PermissionResponseDto,
    })
    async getRolePermissionForResource(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('resource') resource: string,
    ): Promise<PermissionResponseDto | null> {
        const permission =
            await this.getRolePermissionForResourceUseCase.execute({
                roleId,
                resource,
            });
        if (!permission) {
            return null;
        }
        return this.toPermissionResponseDto(permission);
    }

    @Post('check')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verificar si un rol tiene permiso para una acción sobre un recurso',
        description:
            'Devuelve true/false según la tabla de permisos (deny by default si no hay registro).',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Resultado de la comprobación de permiso',
        schema: {
            example: { allowed: true },
        },
    })
    async checkPermission( @Body() body: CheckPermissionRequestDto ): Promise<{ allowed: boolean }> {
        const dto: CheckPermissionDto = {
            roleId: body.roleId,
            resource: body.resource,
            action: body.action as any,
        };
        const allowed = await this.checkPermissionUseCase.execute(dto);
        return { allowed };
    }

    private toPermissionResponseDto( permission: PermissionOutputDto ): PermissionResponseDto {
        const dto = new PermissionResponseDto();
        dto.id = permission.id;
        dto.roleId = permission.roleId;
        dto.resource = permission.resource;
        dto.canRead = permission.canRead;
        dto.canCreate = permission.canCreate;
        dto.canUpdate = permission.canUpdate;
        dto.canDelete = permission.canDelete;
        return dto;
    }
    private toRolePermissionsResponseDto( roleId: number, permissions: PermissionOutputDto[] ): RolePermissionsResponseDto {
        const dto = new RolePermissionsResponseDto();
        dto.roleId = roleId;
        dto.permissions = permissions.map((p) =>
            this.toPermissionResponseDto(p),
        );
        return dto;
    }
}