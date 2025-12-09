import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from './permission.response.dto';

export class RolePermissionsResponseDto {
    @ApiProperty({
        description: 'ID del rol',
        example: 1,
    })
    roleId!: number;

    @ApiProperty({
        description: 'Lista de permisos asociados a este rol',
        type: [PermissionResponseDto],
    })
    permissions!: PermissionResponseDto[];
}